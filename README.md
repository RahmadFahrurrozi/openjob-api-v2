# OpenJob Submission (Version 2)

Final Capstone Project for the ASAH Scholarship Program (Back-End Developer Track), organized by Dicoding Indonesia in partnership with GoTo.

---

## Submission Structure

This submission consists of two independent Node.js applications that communicate asynchronously via RabbitMQ:

```text
Submission
├── openjob_api
│   ├── src
│   ├── migrations
│   ├── package.json
│   ├── docker-compose.yml
│   ├── .env.example
│   └── README.md
└── openjob_consumer
    ├── src
    │   ├── config
    │   └── consumer.js
    ├── package.json
    ├── .env.example
    └── README.md
```

---

## Applications Overview

### 1. openjob_api (RESTful API Service & Event Producer)
A comprehensive RESTful API service built with Express.js and PostgreSQL. It features:
* Document Storage: PDF upload, retrieval, and deletion using Multer.
* Distributed Caching: Multi-endpoint Redis caching with automated cache invalidation and custom provenance headers.
* Message Queue Producer: Asynchronous, non-blocking publishing of new application events to RabbitMQ.

### 2. openjob_consumer (Standalone Consumer & Email Worker)
An autonomous worker application built with Node.js and Nodemailer. It features:
* Message Queue Consumer: Asynchronous consumption of application events from RabbitMQ.
* Dynamic Data Resolution: Queries PostgreSQL to dynamically identify the designated Job Owner and applicant details.
* Email Notification Delivery: Dispatches professional notification emails to Job Owners using Nodemailer.
