const payment = require('../models/paymentSchema')

const { Payment } = require('ecommpay');

const paymentSchema = require('../validators/validators.payment.js')

const { Callback } = require('ecommpay');

const projectId = process.env.project_id;

const secret_salt = process.env.secret_salt;

// In-memory payment status store for polling

// Key: paymentId, Value: { status: 'pending'|'success'|'fail'|'decline'|'error', data: object|null, updatedAt: Date }

const paymentStatusStore = new Map();

if (!projectId || !secret_salt) {

    console.error("Missing projectId or secret_salt in environment variables");

    process.exit(1);

}

const createPayment = async (req, res) => {

    try {

        const { name, cardNumber, month, year, securityCode } = req.body;

        const newPayment = new payment({

            name,

            cardNumber,

            month,

            year,

            securityCode

        });

        await newPayment.save();

        res.status(201).json({ message: "Payment added successfully", payment: newPayment });

    } catch (error) {

        res.status(500).json({ message: "Error adding payment", error: error.message });

    }

};

const getPaymentById = async (req, res) => {

    try {

        const payment_ = await payment.findById(req.params.id);

        if (!payment_) {

            return res.status(404).json({ message: "Payment not found" });

        }

        res.status(200).json(payment_);

    } catch (error) {

        res.status(500).json({ message: "Error fetching payment", error: error.message });

    }

};

const initiatePayment = async (req, res) => {

    try {

        const { error } = paymentSchema.validate(req.body);

        if (error) return res.status(400).send(error.message);

        const {

            phone,

            email,

            postal,

            country,

            city,

            address,

            amount,

            currency,

            customerId,

            paymentId

        } = req.body;

        const payment = new Payment(projectId, secret_salt);

        payment.paymentId = paymentId;

        payment.paymentAmount = amount;

        payment.paymentCurrency = currency;

        payment.customerId = customerId;

        // 3D Secure and Billing Info

        payment.paymentCustomerPhone = phone;

        payment.paymentCustomerEmail = email;

        payment.paymentBillingPostal = postal;

        payment.paymentBillingCountry = country;

        payment.paymentBillingCity = city;

        payment.paymentBillingAddress = address;

        // Initialize status as pending for polling

        paymentStatusStore.set(paymentId, {

            status: 'pending',

            data: null,

            updatedAt: new Date()

        });

        const url = await payment.getUrl();

        return res.status(200).json({ paymentUrl: url });

    } catch (err) {

        console.error("Error initiating payment:", err);

        // Best-effort error state if paymentId provided

        if (req?.body?.paymentId) {

            paymentStatusStore.set(req.body.paymentId, {

                status: 'error',

                data: { message: 'initiatePayment_failed' },

                updatedAt: new Date()

            });

        }

        return res.status(500).json({ message: "Internal Server Error" });

    }

};

const handleCallback = async (req, res) => {

    try {

        let paymentId = null;

        let paymentData = null;

        let status = null;

        try {

            const callback = new Callback(secret_salt, req.body);

            if (typeof callback.isSignatureValid === 'function' && !callback.isSignatureValid()) {

                return res.status(400).send('Bad Request: Invalid signature');

            }

            paymentId = typeof callback.getPaymentId === 'function' ? callback.getPaymentId() : null;

            paymentData = typeof callback.payment === 'function' ? callback.payment() : null;

            status = typeof callback.isPaymentSuccess === 'function' && callback.isPaymentSuccess()

                ? 'success'

                : (paymentData && paymentData.status) || null;

        } catch (sdkErr) {

            console.warn('Ecommpay SDK callback helper unavailable; falling back to raw payload parsing');

        }

        // Fallback to raw payload if SDK helpers are not available

        if (!paymentId) paymentId = req?.body?.payment?.id || req?.body?.payment_id || req?.body?.paymentId;

        if (!paymentData) paymentData = req.body?.payment || req.body || {};

        if (!status) status = paymentData?.status || req.body?.status || 'processing';

        if (!paymentId) {

            return res.status(400).send('Bad Request: Missing paymentId');

        }

        if (status === 'success') {

            console.log('Payment Success:', paymentId, status);

            paymentStatusStore.set(paymentId, { status: 'success', data: paymentData, updatedAt: new Date() });

            // TODO: await markOrderAsPaid(paymentId);

            // TODO: await sendConfirmationEmail();

        } else if (status === 'decline' || status === 'fail') {

            console.warn('Payment failed:', paymentId, status);

            paymentStatusStore.set(paymentId, { status, data: paymentData, updatedAt: new Date() });

            // TODO: await logFailureToDB(paymentId);

        } else {

            console.log('Informational callback received:', status);

            paymentStatusStore.set(paymentId, { status: status || 'processing', data: paymentData, updatedAt: new Date() });

        }

        return res.status(200).send('OK');

    } catch (err) {

        console.error('Server error processing callback:', err);

        try {

            const maybeId = req?.body?.payment?.id || req?.body?.payment_id || req?.body?.paymentId;

            if (maybeId) {

                paymentStatusStore.set(maybeId, { status: 'error', data: { message: 'callback_processing_failed' }, updatedAt: new Date() });

            }

        } catch (_) { /* ignore */ }

        return res.status(500).send('Internal Server Error');

    }

};

// Polling endpoint: returns status for a given paymentId

const getPaymentStatus = async (req, res) => {

    try {

        const { paymentId } = req.params;

        if (!paymentId) {

            return res.status(400).json({ message: 'paymentId is required' });

        }

        const entry = paymentStatusStore.get(paymentId);

        if (!entry) {

            // If no entry yet, treat as pending to simplify client logic

            return res.status(200).json({ status: 'pending', data: null });

        }

        return res.status(200).json({ status: entry.status, data: entry.data });

    } catch (err) {

        return res.status(500).json({ message: 'Internal Server Error' });

    }

};

module.exports = {

    createPayment,

    initiatePayment,

    getPaymentById,

    handleCallback,

    getPaymentStatus

};
