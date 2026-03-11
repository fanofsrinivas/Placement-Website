const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            enum: [
                'USER_REGISTERED', 'USER_VERIFIED', 'USER_REJECTED', 'USER_LOGIN',
                'JOB_POSTED', 'JOB_APPROVED', 'JOB_REJECTED',
                'APPLICATION_SUBMITTED', 'APPLICATION_STAGE_CHANGED',
                'DRIVE_CREATED', 'DRIVE_UPDATED',
                'LEGACY_DATA_IMPORTED', 'PROFILE_UPDATED',
                'PASSWORD_RESET', 'OFFER_APPROVED',
            ],
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        target: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'targetModel',
        },
        targetModel: {
            type: String,
            enum: ['User', 'Job', 'Application', 'Drive'],
        },
        details: mongoose.Schema.Types.Mixed,
        ipAddress: String,
    },
    { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ actor: 1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
