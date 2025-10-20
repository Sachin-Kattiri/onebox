# ReachInbox Onebox – Real-Time AI Email Assistant

A real-time AI-powered email assistant that syncs emails via IMAP, indexes them for fast search, categorizes them using an LLM (Gemini API), triggers Slack/webhook notifications for interested leads, and suggests contextually relevant replies using RAG (Retrieval-Augmented Generation).

---

## Table of Contents

- [Architecture Overview](#architecture-overview)  
- [Setup Instructions](#setup-instructions)  
- [Feature Implementation](#feature-implementation)  
- [API Endpoints](#api-endpoints)  
- [Evaluation & Notes](#evaluation--notes)  
- [References](#references)  

---

## Architecture Overview

The system consists of three primary layers:

1. **IMAP Sync Service (Phase 1)**  
   - Maintains a persistent real-time connection with email servers using IMAP IDLE.  
   - Fetches initial emails and listens for new messages without polling.  
   - Extracts metadata and plaintext content for indexing.  

2. **Persistence Layer (Phase 2 & 6)**  
   - **Elasticsearch:** Stores email metadata and full-text content for search and filtering.  
   - **Vector Database (Qdrant):** Stores embeddings for RAG-based suggested replies.  

3. **API & Integration Layer (Phase 3, 4 & 6)**  
   - **Node.js/TypeScript REST API:** Serves search, filtering, and suggested replies.  
   - **Gemini LLM API:** Categorizes emails (`Interested`, `Meeting Booked`, `Not Interested`, `Spam`, `Out of Office`).  
   - **Slack/Webhook Integration:** Sends notifications for emails labeled as `Interested`.  

---

## Setup Instructions

### Prerequisites

- Node.js >= 20  
- Docker & Docker Compose  
- Environment variables configured (`.env` file):  

