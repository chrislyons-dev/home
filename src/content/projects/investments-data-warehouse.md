---
title: 'Investments Data Warehouse & AI Platform'
description: 'Unified data platform for investment analytics. Tiered pipelines (real-time to daily batch), Snowflake warehouse, REST APIs, and MCP integration for AI access.'
tech: ['Python', 'AWS Glue', 'Spark', 'S3', 'Snowflake', 'MCP', 'Node.js']
featured: false
order: 4
---

Investment team had data scattered across 12 systems. Near-real-time price, purchase, & disposal feeds. Daily batch reports. No single source of truth.

Built a unified warehouse with tiered pipelines. Different data, different speeds.

The architecture:

- Near real-time pipelines for volatile market data (prices that change by the second)
- Daily batch for static datasets (fundamentals, earnings, holdings)
- Snowflake-based warehouse with curated data products for different teams
- RESTful APIs exposing investment metrics and portfolio analytics
- Model Context Protocol (MCP) integration " LLMs query investment data directly
