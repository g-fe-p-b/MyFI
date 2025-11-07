import mongoose from 'mongoose';
import autoIncrementId from '../plugins/custom-auto-increment-id.plugin.js';

/**
 * Consent model for Open Finance flows.
 * Fields:
 * - customerId: reference to Customer.customerId
 * - requester: information about the requesting institution
 * - scopes: array of requested scopes (e.g. 'ACCOUNTS_READ', 'TRANSACTIONS_READ', 'CUSTOMER_BASIC')
 * - status: PENDING | AUTHORIZED | REJECTED | REVOKED
 * - expiresAt: Date when consent expires
 * - apiKey: generated token returned to requester to fetch data (kept secret)
 */

const consentSchema = new mongoose.Schema({
    customerId: {
        type: String,
        ref: 'Customer',
        required: true,
    },
    requester: {
        name: { type: String, required: true },
        institutionId: { type: String, required: false },
        contact: { type: String, required: false },
    },
    scopes: [{
        type: String,
        required: true,
    }],
    status: {
        type: String,
        enum: ['PENDING', 'AUTHORIZED', 'REJECTED', 'REVOKED'],
        default: 'PENDING',
    },
    expiresAt: {
        type: Date,
        default: () => new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    },
    apiKey: {
        type: String,
        required: false,
    },
    approvedBy: { type: String, ref: 'Customer', required: false },
    approvedAt: { type: Date, required: false },
}, { timestamps: true });

consentSchema.plugin(autoIncrementId, {
    modelName: 'Consent', prefix: 'con_', paddingLength: 3
});

const Consent = mongoose.model('Consent', consentSchema);

export default Consent;