/**
*   This file is part of email-sender.
*
*   email-sender is free software: you can redistribute it and/or modify
*   it under the terms of the GNU Lesser General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   email-sender is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU Lesser General Public License for more details.
*
*   You should have received a copy of the GNU Lesser General Public License
*   along with email-sender.  If not, see <https://www.gnu.org/licenses/>.
*/

const Joi = require('joi');
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now },
    from: {
        type: String,
        required: true },
    to: {
        type: [String],
        required: true },
    cc: {
        type: [String],
        required: false },
    bcc: {
        type: [String],
        required: false },
    subject: {
        type: String,
        required: true },
    text: {
        type: String,
        required: false },
    html: {
        type: String,
        required: false },
    result: Object,
    error: Object
});

const Email = mongoose.model('Email', emailSchema);

function validateEmail(email) {
    const schema = {
        from: Joi.string().min(5).max(255).email().required(),
        to: Joi.array().items(Joi.string().min(5).max(255).email()).required(),
        cc: Joi.array().items(Joi.string().min(5).max(255).email()).optional(),
        bcc: Joi.array().items(Joi.string().min(5).max(255).email()).optional(),
        subject: Joi.string().required(),
        text: Joi.string().optional(),
        html: Joi.string().optional(),
    };

    return Joi.validate(email, schema);
}

exports.Email = Email;
exports.validate = validateEmail;
