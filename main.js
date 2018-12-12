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

const mongoose = require('mongoose');
const emails = require('./routes/emails');
const config = require('config');
const debug = require('debug')('main');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use('/api/emails', emails);

// Get database connect information
const userPass = config.get('mongodb.auth.username') ?
    `${[config.get('mongodb.auth.username'), config.get('mongodb.auth.password')].join(':')}@` : '';
const hostPort = [config.get('mongodb.host'), config.get('mongodb.port')].join(':');
const options = config.get('mongodb.options') ? `?${config.get('mongodb.options')}` : '';

const dbConnectString = `mongodb://${userPass}${hostPort}/${config.get('mongodb.database')}${options}`;

debug(dbConnectString);

mongoose.connect(dbConnectString, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(() => debug('Connected to mongoDB...'))
    .catch((err) => debug('Could not connect to mongoDB...'));

app.listen(config.get('express.port'), () =>
    debug(`Listening for HTTP-requests on port ${config.get('express.port')}...`));

console.log('Running...');
