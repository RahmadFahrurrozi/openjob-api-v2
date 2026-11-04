# OpenJob RESTful API (Version 2)

Final Capstone Project for the ASAH Scholarship Program (Back-End Developer Track), organized by Dicoding Indonesia in partnership with GoTo.

---

## Project Overview

OpenJob RESTful API is a production-grade backend service designed to power a modern job board platform. The system facilitates end-to-end recruitment workflows, enabling candidates to explore career opportunities, upload professional resumes, and apply for positions, while providing employers with robust tools to publish vacancies and review applicant submissions.

Version 2 builds upon the foundational REST architecture of Version 1 by integrating three distributed systems capabilities: physical document storage, multi-layer caching, and asynchronous event messaging.

---

## System Architecture and Capabilities

### 1. Document Storage Subsystem
* Powered by Multer middleware for handling multipart/form-data.
* Implements strict validation ensuring only PDF documents (`application/pdf`) up to 5 MB are accepted.
* Stores document metadata within PostgreSQL while persisting files safely on the storage layer.
* Provides retrieval endpoints delivering appropriate `Content-Type: application/pdf` and `Content-Disposition` headers for inline viewing or download, as well as cascading deletion of file assets upon record removal.

### 2. High-Performance Caching Subsystem
* Built on Redis to accelerate read performance and reduce PostgreSQL database load.
* Implements a standard 3600-second (1-hour) Time-To-Live (TTL) strategy.
* Emits a custom HTTP header (`X-Data-Source: cache` vs. `X-Data-Source: database`) indicating data provenance.
* Features targeted automated cache invalidation, ensuring cache consistency across company profiles, candidate details, job listings, applications, and saved bookmarks whenever state-changing mutations occur.

### 3. Asynchronous Message Broker Subsystem (Producer)
* Employs RabbitMQ for decoupled, non-blocking task processing.
* When candidates submit an application, a lightweight event payload containing the application identifier is published to the message broker within milliseconds (`responseTime < 5000ms`).
* Events published to the `openjob:applications` queue are processed by the companion OpenJob Consumer application.

---

## Technology Stack

* Runtime Environment: Node.js (v22+ LTS)
* HTTP Framework: Express.js
* Database: PostgreSQL
* Cache Layer: Redis
* Message Broker: RabbitMQ (AMQP via amqplib)
* Object Storage Handler: Multer
* Authentication: JSON Web Tokens (Access and Refresh Token Strategy)
* Schema Validation: Joi
* Code Quality: ESLint, Prettier
