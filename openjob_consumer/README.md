# OpenJob Consumer Application

## Project Overview

OpenJob Consumer is an independent background worker service designed to process asynchronous events from RabbitMQ for the OpenJob platform.

The application continuously listens to incoming job application events, queries applicant and job owner data dynamically from PostgreSQL, and dispatches email notifications to job owners via Nodemailer.

## Key Capabilities

* Asynchronous message consumption from RabbitMQ.
* Dynamic recipient and applicant data resolution from PostgreSQL.
* Automated notification email delivery to Job Owners using Nodemailer.
* Graceful termination handling with connection cleanup.

## Technology Stack

* Runtime: Node.js
* Message Broker: RabbitMQ (AMQP via amqplib)
* Database Driver: PostgreSQL (pg)
* Mailer: Nodemailer
