# 🚀 ReachInbox-Onebox: AI-Powered Email Management

An intelligent email management and outreach tool that provides real-time email synchronization, AI-powered categorization, powerful search capabilities, and RAG-based suggested replies.

---

## ✨ Features

* **⚡ Real-Time Email Sync:** Uses **IMAP IDLE** for event-driven, real-time synchronization of multiple email accounts without polling. Maintains persistent connections and handles reconnects automatically.
* **🔍 Powerful Search:** All incoming emails are immediately indexed in **Elasticsearch**, enabling full-text search on subjects and bodies, along with fast keyword filtering by account or folder.
* **🤖 AI Email Categorization:** Leverages the **Gemini LLM API** to automatically classify emails into one of five key labels: `Interested`, `Meeting Booked`, `Not Interested`, `Spam`, or `Out of Office`.
* **🔗 Smart Integrations:** Sends instant notifications to **Slack** and triggers external **webhooks** for important events, such as when an email is categorized as `Interested`.
* **💡 RAG-Based Suggested Replies (Bonus):** Generates context-aware, professional reply suggestions. It converts email text into embeddings, retrieves relevant context from a **Qdrant Vector DB**, and uses the Gemini API to craft a concise reply.
* **🖥️ Simple Frontend UI:** A clean interface to display emails, filter by account/folder, view AI category tags, and utilize the search functionality.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js, TypeScript
* **Email Protocol:** `node-imap`
* **Search & Indexing:** Elasticsearch
* **Vector Database:** Qdrant
* **AI & Embeddings:** Gemini API
* **Containerization:** Docker & Docker Compose

---

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later recommended)
* [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

### 2. Environment Variables

Create a `.env` file in the root of the project and add the following environment variables.

```env
# IMAP Account 1 Credentials
IMAP_USER_1=user1@example.com
IMAP_PASS_1=your_app_password_1

# IMAP Account 2 Credentials
IMAP_USER_2=user2@example.com
IMAP_PASS_2=your_app_password_2

# Integration URLs
SLACK_WEBHOOK_URL=[https://hooks.slack.com/services/](https://hooks.slack.com/services/)...
WEBHOOK_SITE_URL=[https://webhook.site/](https://webhook.site/)...

### 3. Project Initialization

Clone the repository and initialize the project.

```bash
# Create and navigate into the project directory
mkdir reachinbox-onebox
cd reachinbox-onebox

# Initialize a Node.js project
npm init -y

# Set up TypeScript
npm install typescript @types/node ts-node --save-dev
npx tsc --init

### 4. Install Dependencies

Install the required npm packages for the project.

```bash
npm install express node-imap @elastic/elasticsearch dotenv node-fetch

### 5. Start Services with Docker

This project relies on Elasticsearch and Qdrant, which will run in Docker containers.

First, create a `docker-compose.yml` file in the root of your project with the following content:

```yaml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.1
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - 9200:9200
    volumes:
      - esdata:/usr/share/elasticsearch/data

  qdrant:
    image: qdrant/qdrant
    ports:
      - 6333:6333
      - 6334:6334
    volumes:
      - qdrant_storage:/qdrant/storage

volumes:
  esdata:
    driver: local
  qdrant_storage:
    driver: local

### 6. Run the Application

Once all dependencies are installed and the Docker services are running, you can start the application.

Run the following command from the root directory of your project:

```bash
ts-node src/index.ts

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key
