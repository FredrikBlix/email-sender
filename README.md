# email-sender

This application is and HTTP-service email sender. It sends emails and stores them in a mongo database.

It is build in [node](https://nodejs.org) and uses [nodemailer](https://www.npmjs.com/package/nodemailer) for sending emails.

### Environental variables

**email_Port** - HTTP server port (default: 80)

**email_SMTP_HOST** - smtp server

**email_SMTP_PORT** - smtp server port

**email_SMTP_SECURE** - should not be set for all ports except 465

**email_SMTP_USERNAME** - smtp username

**email_SMTP_PASSWORD** - smtp password


**email_DB_HOST** - MongoDB host

**email_DB_PORT** - MongoDB port (default: 27071)

**email_DB_NAME** - Database name

**email_DB_USERNAME** - Database username

**email_DB_PASSWORD** - Database password

**email_MONGODB_OPTIONS** - mongo database connection options


## Docker

To run a docker image with this code, use the `docker-compose.yml` file, found in the repo or run using the docker command:

```
$ sudo docker run --detach \
    --publish 8080:80 \
    --name email-sender \
    --restart always \
    --net=bridge \
    --env email_SMTP_HOST="smtp.server.com" \
    --env email_SMTP_PORT="25" \
    --env email_SMTP_SECURE= \
    fredrikblix/email-sender:latest
```
