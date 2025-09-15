🌍 Carbon Credit Trading Platform
📌 Overview

The Carbon Credit Trading Platform is a blockchain-driven system designed to monitor, manage, and trade carbon credits transparently.
It integrates IoT-based emission tracking (simulated for demo), AI/analytics, and a blockchain marketplace for buying, selling, and earning credits.

This project was built as part of a hackathon to showcase how India can implement a dynamic, fair, and transparent carbon governance system aligned with government norms and SDGs.

✨ Features
🔑 Authentication & Profiles

BEE ID Login System – Only registered industries (e.g., JSW Steel, ACC Cement, HPCL Refinery) can log in.

Company Profile Page – Displays each company’s:

Bee ID, name, sector, and location

Emission cap (allocated annually)

Current SEC (Specific Energy Consumption)

CO₂ emissions (t/hr)

Carbon credits balance

BEE star rating

📊 Live Dashboard

IoT Integration (Simulated) – Randomized emission & AQI data feeds for demo.

Real-Time Tracking – Shows:

Current emissions

SEC vs Target SEC (efficiency gap)

Emission balance left for compliance year

Dynamic Visualization – Line charts compare previous vs current year emissions.

🛒 Marketplace

Buy Credits – Industries exceeding their cap can purchase credits.

Sell Credits – Companies under-emitting can list credits for sale (with price & quantity).

Smart Contract Simulation – Ensures transparency and immutability in credit transfers.

Transaction History – Tracks all trades and compliance-related activity.

💡 Earn Credits (Alternative Options)

Companies can earn new credits (instead of just buying) via:

Carbon Reduction Challenges (Proof-of-Green) – Verified efficiency measures reduce SEC and generate credits.

Proof-of-Renewable Integration – Linking renewable energy usage (solar, wind, hydro) to blockchain for bonus credits.

🔗 Blockchain Features

Every credit is recorded as a tokenized asset (ERC-20/1155 simulation).

Immutable Ledger – Transactions are permanent & tamper-proof.

Smart Contracts handle:

Credit issuance after verification

Buy/Sell trades

Yearly refresh of credits

📑 Compliance Rules

Credits issued annually at year-end after MRV (Monitoring, Reporting, Verification).

1 Credit = 1 Tonne CO₂ equivalent.

Surplus credits can be sold; deficit must be bought.

Companies cannot cover >30% of excess emissions by purchase → must switch to renewables or efficiency improvements.

🌱 SDG Alignment

SDG 7 – Affordable & Clean Energy

SDG 9 – Industry, Innovation & Infrastructure

SDG 12 – Responsible Consumption & Production

SDG 13 – Climate Action

🏗️ Tech Stack

Frontend: React + Vite

Routing: React Router DOM

Charts: Recharts

Styling: TailwindCSS / Custom CSS

Blockchain Simulation: Smart contract logic mock (future integration with Polygon/Ethereum testnet)

IoT Simulation: Random emission generator (future integration with ESP32 sensors)

🏭 Demo Companies (BEE IDs)

JSW Steel Bengaluru (BEE-KA-S001)

ACC Cement Bengaluru (BEE-KA-C001)

HPCL Refinery Bengaluru (BEE-KA-R001)

🚀 How It Works (Flow)

Login with valid Bee ID.

View company profile with cap, SEC, credits, and live emissions.

Track yearly progress in dashboard & charts.

Buy/Sell credits in the marketplace.

Earn credits via Challenges & Renewable Integration.

End of year → Credits refreshed, performance verified (MRV).
