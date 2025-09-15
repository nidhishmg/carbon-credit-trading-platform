import type { Company } from '../App';

export interface ChatResponse {
  content: string;
  suggestions?: string[];
}

export class ChatService {
  private company: Company | null;
  private allCompanies: Company[];

  constructor(company: Company | null, allCompanies: Company[]) {
    this.company = company;
    this.allCompanies = allCompanies;
  }

  async processMessage(message: string): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase();

    // Greeting responses
    if (this.containsAny(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
      return this.handleGreeting();
    }

    // Thank you responses
    if (this.containsAny(lowerMessage, ['thank you', 'thanks', 'appreciate'])) {
      return this.handleThanks();
    }

    // Sector comparison queries
    if (this.containsAny(lowerMessage, ['compare', 'comparison', 'sector', 'peers', 'other companies', 'benchmark'])) {
      return this.handleSectorComparison();
    }

    // BEE rating queries
    if (this.containsAny(lowerMessage, ['bee', 'rating', 'efficiency', 'sec', 'energy consumption'])) {
      return this.handleBEERatingQuery();
    }

    // Emissions queries
    if (this.containsAny(lowerMessage, ['emissions', 'carbon', 'co2', 'greenhouse', 'pollution'])) {
      return this.handleEmissionsQuery();
    }

    // Credits queries
    if (this.containsAny(lowerMessage, ['credits', 'trading', 'buy', 'sell', 'balance', 'purchase'])) {
      return this.handleCreditsQuery();
    }

    // Sustainability suggestions
    if (this.containsAny(lowerMessage, ['improve', 'suggestions', 'recommendations', 'sustainability', 'green'])) {
      return this.handleSustainabilityQuery();
    }

    // Top performers queries
    if (this.containsAny(lowerMessage, ['top', 'best', 'leaders', 'performers', 'highest', 'winners'])) {
      return this.handleTopPerformersQuery();
    }

    // Platform navigation help
    if (this.containsAny(lowerMessage, ['navigate', 'help', 'guide', 'how to', 'where', 'find'])) {
      return this.handleNavigationHelp();
    }

    // Target and compliance queries
    if (this.containsAny(lowerMessage, ['target', 'goal', '2025', 'compliance', 'meet', 'achieve'])) {
      return this.handleTargetQuery();
    }

    // Metrics explanation
    if (this.containsAny(lowerMessage, ['explain', 'what is', 'meaning', 'understand', 'definition'])) {
      return this.handleExplanationQuery(lowerMessage);
    }

    // Default response with suggestions
    return this.handleDefaultQuery();
  }

  private handleSectorComparison(): ChatResponse {
    if (!this.company) {
      return {
        content: "Please log in to compare your company's performance with sector peers.",
        suggestions: ["How do I log in?", "Show all companies"]
      };
    }

    const sectorCompanies = this.allCompanies.filter(c => 
      c.sector === this.company!.sector && c.id !== this.company!.id
    );

    if (sectorCompanies.length === 0) {
      return {
        content: `You're currently the only ${this.company.sector} company in our platform. More companies will be added soon!`,
        suggestions: ["Show my emissions data", "Explain my BEE rating"]
      };
    }

    // Sort by emissions (lower is better)
    const companiesWithEmissions = [this.company, ...sectorCompanies]
      .sort((a, b) => a.emissions.current - b.emissions.current);

    const yourRank = companiesWithEmissions.findIndex(c => c.id === this.company!.id) + 1;
    const totalCompanies = companiesWithEmissions.length;

    const bestPerformer = companiesWithEmissions[0];
    const avgEmissions = companiesWithEmissions.reduce((sum, c) => sum + c.emissions.current, 0) / totalCompanies;

    let content = `📊 **${this.company.sector} Sector Comparison**\n\n`;
    content += `Your Position: **${yourRank}/${totalCompanies}** in emissions performance\n\n`;
    content += `**Your Emissions:** ${(this.company.emissions.current / 1000000).toFixed(1)}M tCO2e\n`;
    content += `**Sector Average:** ${(avgEmissions / 1000000).toFixed(1)}M tCO2e\n`;
    
    if (bestPerformer.id !== this.company.id) {
      content += `**Best Performer:** ${bestPerformer.name} (${(bestPerformer.emissions.current / 1000000).toFixed(1)}M tCO2e)\n\n`;
      const improvement = ((this.company.emissions.current - bestPerformer.emissions.current) / 1000000).toFixed(1);
      content += `💡 You could reduce **${improvement}M tCO2e** to match the sector leader!`;
    } else {
      content += `\n🏆 **Congratulations!** You're the top performer in your sector!`;
    }

    return {
      content,
      suggestions: [
        "How can I improve my ranking?",
        "Show BEE ratings comparison",
        "What are the best practices?",
        "Show sustainability suggestions"
      ]
    };
  }

  private handleBEERatingQuery(): ChatResponse {
    if (!this.company) {
      return {
        content: "Please log in to see your BEE rating details.",
        suggestions: ["How do I log in?"]
      };
    }

    const { beeData } = this.company;
    const improvementPct = ((beeData.targetSEC - beeData.currentSEC) / beeData.currentSEC * 100).toFixed(1);

    let content = `⭐ **Your BEE (Bureau of Energy Efficiency) Rating**\n\n`;
    content += `**Current Rating:** ${beeData.beeRating}/5 stars\n`;
    content += `**Compliance Status:** ${beeData.complianceStatus}\n\n`;
    content += `**Energy Performance:**\n`;
    content += `• Current SEC: ${beeData.currentSEC} GJ/tonne\n`;
    content += `• Target SEC: ${beeData.targetSEC} GJ/tonne\n`;
    content += `• Required Improvement: ${Math.abs(parseFloat(improvementPct))}%\n\n`;

    if (beeData.beeRating >= 4) {
      content += `🎉 Excellent performance! You're meeting or exceeding efficiency standards.`;
    } else if (beeData.beeRating >= 3) {
      content += `👍 Good performance, but there's room for improvement to reach higher ratings.`;
    } else {
      content += `⚠️ Attention needed: Focus on energy efficiency improvements to meet targets.`;
    }

    return {
      content,
      suggestions: [
        "How to improve BEE rating?",
        "Compare with sector peers",
        "Show energy efficiency tips",
        "What is SEC?"
      ]
    };
  }

  private handleEmissionsQuery(): ChatResponse {
    if (!this.company) {
      return {
        content: "Please log in to see your emissions data.",
        suggestions: ["How do I log in?"]
      };
    }

    const { emissions } = this.company;
    const reductionProgress = ((emissions.baseline - emissions.current) / emissions.baseline * 100).toFixed(1);
    const targetProgress = ((emissions.baseline - emissions.target) / emissions.baseline * 100).toFixed(1);

    let content = `🌍 **Your Carbon Emissions Overview**\n\n`;
    content += `**Current Emissions:** ${(emissions.current / 1000000).toFixed(2)}M tCO2e\n`;
    content += `**2025 Target:** ${(emissions.target / 1000000).toFixed(2)}M tCO2e\n`;
    content += `**Baseline (2024):** ${(emissions.baseline / 1000000).toFixed(2)}M tCO2e\n\n`;
    content += `**Progress Tracking:**\n`;
    content += `• Current Reduction: ${reductionProgress}%\n`;
    content += `• Target Reduction: ${targetProgress}%\n`;
    content += `• Yearly Reduction: ${(emissions.yearlyReduction / 1000000).toFixed(2)}M tCO2e\n\n`;

    if (parseFloat(reductionProgress) >= parseFloat(targetProgress)) {
      content += `🎯 **Great job!** You're on track to meet your 2025 targets!`;
    } else {
      const needed = (emissions.current - emissions.target) / 1000000;
      content += `📈 You need to reduce **${needed.toFixed(2)}M tCO2e** more to meet your 2025 target.`;
    }

    return {
      content,
      suggestions: [
        "How can I reduce emissions?",
        "Compare with sector peers",
        "Show sustainability suggestions",
        "What projects can help?"
      ]
    };
  }

  private handleCreditsQuery(): ChatResponse {
    if (!this.company) {
      return {
        content: "Please log in to see your carbon credits information.",
        suggestions: ["How do I log in?"]
      };
    }

    const { credits } = this.company;
    const netCredits = credits.purchased - credits.sold;
    const portfolioValue = credits.balance * 25.5; // Assuming ₹25.5 per credit

    let content = `💰 **Your Carbon Credits Portfolio**\n\n`;
    content += `**Current Balance:** ${credits.balance.toLocaleString()} credits\n`;
    content += `**Portfolio Value:** ₹${portfolioValue.toLocaleString()}\n\n`;
    content += `**Trading Activity:**\n`;
    content += `• Credits Purchased: ${credits.purchased.toLocaleString()}\n`;
    content += `• Credits Sold: ${credits.sold.toLocaleString()}\n`;
    content += `• Net Position: ${netCredits.toLocaleString()} credits\n\n`;
    content += `**Recent Performance:**\n`;
    content += `• Credits Gained (This Year): ${credits.gainedThisYear.toLocaleString()}\n`;
    content += `• Previous Year: ${credits.previousYearGained.toLocaleString()}\n\n`;

    if (netCredits > 0) {
      content += `📈 You're a net buyer, investing in carbon reduction projects!`;
    } else {
      content += `📉 You're a net seller, generating credits from your efficiency improvements!`;
    }

    return {
      content,
      suggestions: [
        "How to earn more credits?",
        "Where to buy credits?",
        "Show marketplace",
        "Trading strategies"
      ]
    };
  }

  private handleSustainabilityQuery(): ChatResponse {
    if (!this.company) {
      return {
        content: "Please log in to see personalized sustainability recommendations.",
        suggestions: ["How do I log in?"]
      };
    }

    const suggestions = this.company.sustainabilitySuggestions?.slice(0, 3) || [];

    let content = `🌱 **Sustainability Improvement Recommendations**\n\n`;
    
    if (suggestions.length === 0) {
      content += `Great job! You're performing excellently across all sustainability metrics. Keep up the good work!`;
      return {
        content,
        suggestions: ["Compare with sector peers", "Show my achievements"]
      };
    }

    suggestions.forEach((suggestion, index) => {
      content += `**${index + 1}. ${suggestion.title}**\n`;
      content += `Priority: ${suggestion.priority}\n`;
      content += `Impact: ${suggestion.impact}\n`;
      content += `${suggestion.description.slice(0, 100)}...\n\n`;
    });

    content += `💡 Focus on high-priority items for maximum impact on your sustainability goals!`;

    return {
      content,
      suggestions: [
        "Show detailed recommendations",
        "How to implement these?",
        "Calculate potential savings",
        "Track progress"
      ]
    };
  }

  private handleTopPerformersQuery(): ChatResponse {
    const sortedCompanies = [...this.allCompanies]
      .sort((a, b) => {
        // Sort by BEE rating first, then by emission reduction percentage
        const aReduction = (a.emissions.baseline - a.emissions.current) / a.emissions.baseline;
        const bReduction = (b.emissions.baseline - b.emissions.current) / b.emissions.baseline;
        
        if (b.beeData.beeRating !== a.beeData.beeRating) {
          return b.beeData.beeRating - a.beeData.beeRating;
        }
        return bReduction - aReduction;
      });

    const topPerformers = sortedCompanies.slice(0, 3);

    let content = `🏆 **Top Performers Across All Sectors**\n\n`;

    topPerformers.forEach((company, index) => {
      const reductionPct = ((company.emissions.baseline - company.emissions.current) / company.emissions.baseline * 100).toFixed(1);
      
      content += `**${index + 1}. ${company.name}** (${company.sector})\n`;
      content += `• BEE Rating: ${company.beeData.beeRating}/5 stars\n`;
      content += `• Emission Reduction: ${reductionPct}%\n`;
      content += `• Status: ${company.beeData.complianceStatus}\n\n`;
    });

    if (this.company) {
      const yourRank = sortedCompanies.findIndex(c => c.id === this.company!.id) + 1;
      content += `📊 **Your Overall Ranking:** ${yourRank}/${sortedCompanies.length}`;
    }

    return {
      content,
      suggestions: [
        "How can I improve my ranking?",
        "Compare with my sector only",
        "Show best practices",
        "What makes them successful?"
      ]
    };
  }

  private handleNavigationHelp(): ChatResponse {
    let content = `🧭 **Platform Navigation Guide**\n\n`;
    content += `**Main Sections:**\n`;
    content += `• **Profile** - View your company details and performance\n`;
    content += `• **Marketplace** - Buy and sell carbon credits\n`;
    content += `• **My Listings** - Manage your credit offerings\n`;
    content += `• **My Earnings** - Track earnings from renewable projects\n`;
    content += `• **Transactions** - View trading history\n`;
    content += `• **Wallet** - Manage your credit balance\n\n`;
    content += `**Quick Tips:**\n`;
    content += `• Use the navbar at the top to navigate between sections\n`;
    content += `• Your company color theme is used throughout the platform\n`;
    content += `• Click the logout button in the top-left to switch accounts`;

    return {
      content,
      suggestions: [
        "Show my profile",
        "Go to marketplace",
        "Check my transactions",
        "Explain carbon trading"
      ]
    };
  }

  private handleTargetQuery(): ChatResponse {
    if (!this.company) {
      return {
        content: "Please log in to see your 2025 targets and progress.",
        suggestions: ["How do I log in?"]
      };
    }

    const { emissions } = this.company;
    const currentProgress = ((emissions.baseline - emissions.current) / (emissions.baseline - emissions.target) * 100).toFixed(1);
    const timeLeft = new Date(2025, 11, 31).getTime() - new Date().getTime();
    const monthsLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24 * 30));

    let content = `🎯 **Your 2025 Targets & Progress**\n\n`;
    content += `**Target Year:** 2025\n`;
    content += `**Time Remaining:** ~${monthsLeft} months\n\n`;
    content += `**Emission Reduction Target:**\n`;
    content += `• Required: ${((emissions.baseline - emissions.target) / 1000000).toFixed(2)}M tCO2e\n`;
    content += `• Achieved: ${((emissions.baseline - emissions.current) / 1000000).toFixed(2)}M tCO2e\n`;
    content += `• Progress: ${currentProgress}%\n\n`;

    if (parseFloat(currentProgress) >= 100) {
      content += `🎉 **Congratulations!** You've already met your 2025 emission targets!`;
    } else if (parseFloat(currentProgress) >= 75) {
      content += `🟢 **On Track!** You're making excellent progress toward your 2025 goals.`;
    } else if (parseFloat(currentProgress) >= 50) {
      content += `🟡 **Good Progress!** You're halfway there, but acceleration may be needed.`;
    } else {
      content += `🔴 **Action Required!** Significant effort needed to meet 2025 targets.`;
    }

    return {
      content,
      suggestions: [
        "Show action plan for targets",
        "How to accelerate progress?",
        "Compare target progress with peers",
        "Show sustainability suggestions"
      ]
    };
  }

  private handleExplanationQuery(message: string): ChatResponse {
    const explanations: { [key: string]: string } = {
      'bee rating': '⭐ **BEE Rating** (Bureau of Energy Efficiency)\n\nA 1-5 star rating system that measures industrial energy efficiency:\n• 5 stars = Excellent efficiency (top 20%)\n• 4 stars = Good efficiency (next 20%)\n• 3 stars = Average efficiency\n• 2 stars = Below average\n• 1 star = Poor efficiency (bottom 20%)\n\nHigher ratings mean lower energy consumption per unit of production.',
      
      'sec': '⚡ **SEC** (Specific Energy Consumption)\n\nMeasures energy used per unit of production:\n• Steel: GJ per tonne of crude steel\n• Cement: GJ per tonne of cement\n• Oil & Gas: GJ per tonne processed\n\nLower SEC values = better energy efficiency = higher BEE ratings',
      
      'carbon credits': '💰 **Carbon Credits**\n\nTradeable certificates representing 1 tonne of CO2 reduced or avoided:\n• **Earn credits** by reducing emissions below targets\n• **Buy credits** to offset excess emissions\n• **Sell credits** to generate revenue from efficiency gains\n\nCredits help companies meet regulatory targets cost-effectively.',
      
      'carbon intensity': '📊 **Carbon Intensity**\n\nCarbon emissions per unit of economic output (tCO2e per unit production):\n• Lower intensity = more efficient production\n• Key metric for tracking decoupling of growth from emissions\n• Used to benchmark against industry standards',
      
      'baseline': '📈 **Emission Baseline**\n\nYour starting point emissions level (typically 2024) used to measure progress:\n• All reductions calculated from this reference point\n• Government targets often based on baseline years\n• Critical for tracking improvement over time'
    };

    for (const [key, explanation] of Object.entries(explanations)) {
      if (message.includes(key)) {
        return {
          content: explanation,
          suggestions: [
            "Show my current metrics",
            "Compare with industry standards",
            "How to improve this metric?",
            "More definitions"
          ]
        };
      }
    }

    return {
      content: `🤔 I'd be happy to explain! Here are some topics I can help with:\n\n• BEE ratings and energy efficiency\n• Carbon credits and trading\n• SEC (Specific Energy Consumption)\n• Emission baselines and targets\n• Carbon intensity metrics\n\nWhat would you like to understand better?`,
      suggestions: [
        "Explain BEE rating",
        "What are carbon credits?",
        "Define SEC",
        "Show all definitions"
      ]
    };
  }

  private handleDefaultQuery(): ChatResponse {
    const suggestions = [
      "Compare my emissions with sector peers",
      "Explain my BEE rating",
      "Show top performers in my sector",
      "How can I reduce emissions?",
      "What are carbon credits?",
      "Guide me through the platform"
    ];

    return {
      content: `Hello! I'm your Carbon Credit Assistant. I can help you with:\n\n🔍 **Analysis & Comparison**\n• Compare your performance with sector peers\n• Show industry benchmarks and rankings\n\n📊 **Data Explanation**\n• Explain BEE ratings, SEC values, and metrics\n• Break down your sustainability data\n\n💡 **Guidance & Tips**\n• Provide improvement suggestions\n• Help navigate the platform\n\nWhat would you like to know?`,
      suggestions: suggestions.slice(0, 4)
    };
  }

  private containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private handleGreeting(): ChatResponse {
    const greetings = [
      `Hello! 👋 Welcome back to your Carbon Credit Platform!`,
      `Hi there! 🌱 Ready to explore your sustainability data?`,
      `Good to see you! 🌍 How can I help you today?`
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return {
      content: randomGreeting + `\n\nI'm here to help you understand your carbon footprint and compare with industry peers. What would you like to know?`,
      suggestions: [
        "Compare my emissions with sector peers",
        "Show my BEE rating",
        "Explain carbon credits",
        "How can I improve?"
      ]
    };
  }

  private handleThanks(): ChatResponse {
    const responses = [
      "You're welcome! 😊 Happy to help with your sustainability journey!",
      "Glad I could assist! 🌱 Feel free to ask me anything else!",
      "My pleasure! 🌍 I'm here whenever you need carbon credit guidance!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      content: randomResponse,
      suggestions: [
        "Show sector comparison",
        "Explain my metrics",
        "Platform navigation help",
        "More sustainability tips"
      ]
    };
  }
}