export class StampDutyCalculator {
  constructor() {
    // 2025 Victorian stamp duty rates - updated to correct rates
    this.stampDutyRates = [
      { min: 0, max: 25000, rate: 0.014, base: 0 },
      { min: 25001, max: 130000, rate: 0.024, base: 350 },
      { min: 130001, max: 960000, rate: 0.06, base: 2870 },
      { min: 960001, max: 2000000, rate: 0.055, base: 0 }, // 5.5% flat rate
      { min: 2000001, max: Infinity, rate: 0.065, base: 110000 }
    ]

    // Principal Place of Residence rates (only applies up to $550,000)
    this.pprRates = [
      { min: 0, max: 25000, rate: 0.014, base: 0 },
      { min: 25001, max: 130000, rate: 0.024, base: 350 },
      { min: 130001, max: 440000, rate: 0.05, base: 2870 }, // Special PPR rate: 5% instead of 6%
      { min: 440001, max: 550000, rate: 0.06, base: 18370 }, // Special PPR rate: $18,370 + 6%
    ]

    // Titles office fee calculation
    this.titlesOfficeBaseFee = 101.50
    this.titlesOfficeRatePerThousand = 2.34
    this.titlesOfficeMaxFee = 3611.00

    // First home buyer thresholds - correct Victorian rates
    this.fhbFullExemptionLimit = 600000  // Full exemption up to $600,000
    this.fhbConcessionLimit = 750000     // Concession up to $750,000
    
    // Principal Place of Residence discount threshold
    this.pprDiscountLimit = 550000       // PPR discount only applies up to $550,000
  }

  calculateTitlesOfficeFee(propertyValue) {
    // Calculate fee: $101.50 plus $2.34 for every whole $1000 of the price
    const wholeThousands = Math.floor(propertyValue / 1000)
    const calculatedFee = this.titlesOfficeBaseFee + (wholeThousands * this.titlesOfficeRatePerThousand)
    
    // Apply maximum fee cap
    return Math.min(calculatedFee, this.titlesOfficeMaxFee)
  }

  calculateStampDuty(propertyValue, usePPRRates = false) {
    const rates = usePPRRates ? this.pprRates : this.stampDutyRates
    
    for (const bracket of rates) {
      if (propertyValue >= bracket.min && propertyValue <= bracket.max) {
        if (bracket.min === 960001) {
          // Special case: 5.5% flat rate of total dutiable value for $960,001 - $2,000,000
          return propertyValue * bracket.rate
        } else if (bracket.min === 2000001) {
          // Special case: $110,000 plus 6.5% of excess over $2,000,000
          return bracket.base + ((propertyValue - 2000000) * bracket.rate)
        } else {
          // Standard calculation: base + rate * excess over bracket minimum
          const excessAmount = propertyValue - (bracket.min - 1)
          return bracket.base + (excessAmount * bracket.rate)
        }
      }
    }
    return 0
  }

  calculatePrincipalResidenceDiscount(propertyValue) {
    // PPR discount only applies to properties up to $550,000
    if (propertyValue > this.pprDiscountLimit) {
      return {
        stampDuty: this.calculateStampDuty(propertyValue, false), // Use standard rates
        discount: null,
        savings: 0
      }
    }

    // For properties $550,000 and under, calculate PPR discount
    const pprStampDuty = this.calculateStampDuty(propertyValue, true)
    const standardStampDuty = this.calculateStampDuty(propertyValue, false)
    const savings = standardStampDuty - pprStampDuty
    
    if (savings > 0) {
      let discountMessage = `Principal Place of Residence rates applied.`
      
      if (propertyValue > 130000 && propertyValue <= 440000) {
        discountMessage += ` Reduced rate of 5% (instead of 6%) for amounts between $130,001 - $440,000.`
      } else if (propertyValue > 440000 && propertyValue <= 550000) {
        discountMessage += ` Special calculation: $18,370 + 6% for amounts between $440,001 - $550,000.`
      } else if (propertyValue > 130000) {
        discountMessage += ` Reduced rates applied for eligible brackets.`
      }
      
      return {
        stampDuty: pprStampDuty,
        discount: discountMessage,
        savings: savings
      }
    }
    
    return {
      stampDuty: pprStampDuty,
      discount: null,
      savings: 0
    }
  }

  calculateFirstHomeBuyerBenefit(propertyValue) {
    // First home buyers automatically qualify for PPR benefits
    const fullStampDuty = this.calculateStampDuty(propertyValue)

    // Full exemption for properties up to $600,000
    if (propertyValue <= this.fhbFullExemptionLimit) {
      return {
        stampDuty: 0,
        exemption: `Full stamp duty exemption applied for first home buyers on properties up to $${this.fhbFullExemptionLimit.toLocaleString()}.`,
        concession: null,
        discount: null,
        savings: fullStampDuty
      }
    }

    // Concession for properties between $600,001 and $750,000
    if (propertyValue <= this.fhbConcessionLimit) {
      // Calculate the concession amount using the sliding scale
      const excessAmount = propertyValue - this.fhbFullExemptionLimit
      const concessionRange = this.fhbConcessionLimit - this.fhbFullExemptionLimit
      const concessionRate = excessAmount / concessionRange
      
      // The stamp duty payable increases gradually from $0 to full amount
      const discountedStampDuty = fullStampDuty * concessionRate
      const savings = fullStampDuty - discountedStampDuty

      return {
        stampDuty: Math.max(0, discountedStampDuty),
        exemption: null,
        concession: `First home buyer concession applied for properties between $${(this.fhbFullExemptionLimit + 1).toLocaleString()} and $${this.fhbConcessionLimit.toLocaleString()}.`,
        discount: null,
        savings: savings
      }
    }

    // For properties over $750,000, first home buyers still get PPR rates if applicable (up to $550k only)
    return this.calculatePrincipalResidenceDiscount(propertyValue)
  }

  calculate(propertyValue, isFirstHomeBuyer = false, isPrincipalPlace = false) {
    let result

    if (isFirstHomeBuyer) {
      // First home buyers automatically get PPR treatment (where applicable)
      result = this.calculateFirstHomeBuyerBenefit(propertyValue)
    } else if (isPrincipalPlace) {
      // Principal Place of Residence discount (not first home buyer) - only up to $550k
      result = this.calculatePrincipalResidenceDiscount(propertyValue)
    } else {
      // No discounts - pay full stamp duty
      result = {
        stampDuty: this.calculateStampDuty(propertyValue),
        exemption: null,
        concession: null,
        discount: null,
        savings: 0
      }
    }

    // Ensure all properties are present
    if (!result.exemption) result.exemption = null
    if (!result.concession) result.concession = null
    if (!result.discount) result.discount = null

    const titlesOfficeFee = this.calculateTitlesOfficeFee(propertyValue)
    const total = result.stampDuty + titlesOfficeFee

    return {
      ...result,
      titlesOfficeFee: titlesOfficeFee,
      total: total
    }
  }
}