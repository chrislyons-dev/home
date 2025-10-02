---
title: "Executive Cyber Risk Dashboard"
description: "Real-time cyber risk monitoring platform for C-suite executives. Mobile-first iPhone app with live alerts, interactive drilldowns, and comprehensive risk analytics."
tech: ["React", "Python", "AWS Glue", "S3", "Snowflake", "Xcode", "Spark", "WebSockets"]
featured: true
order: 3
---

Built an end-to-end risk intelligence platform delivering real-time cyber threat visibility to executives on mobile and web.

Key achievements:
- Data pipeline processing millions of security events using Spark and AWS Glue
- Native iOS app with real-time alerts via WebSockets for instant risk notifications
- Interactive drill-down capabilities from executive summary to raw security events
- Unified data product with APIs serving both mobile and web applications

## Architecture

The system uses a multi-tier data pipeline with real-time and batch processing:

```mermaid
graph TB
    subgraph "Data Sources"
        SIEM[SIEM Events]
        Vuln[Vulnerability Scans]
        Threat[Threat Intel Feeds]
    end

    subgraph "Ingestion & Processing"
        Glue[AWS Glue ETL]
        Spark[Spark Streaming]
    end

    subgraph "Storage & Analytics"
        S3[S3 Data Lake]
        Snow[Snowflake DW]
    end

    subgraph "API Layer"
        API[REST APIs<br/>Node.js]
        WS[WebSocket Server]
    end

    subgraph "Client Apps"
        iOS[iPhone App<br/>Swift]
        Web[Web Dashboard<br/>React]
    end

    SIEM --> Spark
    Vuln --> Glue
    Threat --> Glue

    Spark --> S3
    Glue --> S3
    S3 --> Snow

    Snow --> API
    API --> WS

    WS --> iOS
    API --> Web
    WS --> Web

    style Snow fill:#29B5E8,color:#fff
    style iOS fill:#007AFF,color:#fff
    style S3 fill:#FF9900,color:#000
```

*Architecture diagram lives in codebase at `docs/architecture/cyber-risk-platform.mmd` and auto-deploys with every change.*
