import './style.css'
import { StampDutyCalculator } from './calculator.js'
import { renderApp } from './app.js'

document.querySelector('#app').innerHTML = renderApp()

// Initialize calculator
const calculator = new StampDutyCalculator()

// Get DOM elements
const propertyValueInput = document.getElementById('propertyValue')
const firstHomeBuyerCheckbox = document.getElementById('firstHomeBuyer')
const principalPlaceCheckbox = document.getElementById('principalPlace')
const calculateButton = document.getElementById('calculateButton')
const resultsDiv = document.getElementById('results')

// Email modal elements
const emailModal = document.getElementById('emailModal')
const closeEmailModalButton = document.getElementById('closeEmailModal')
const cancelEmail = document.getElementById('cancelEmail')
const emailForm = document.getElementById('emailForm')

// SMS modal elements
const smsModal = document.getElementById('smsModal')
const closeSmsModal = document.getElementById('closeSmsModal')
const cancelSms = document.getElementById('cancelSms')
const smsForm = document.getElementById('smsForm')
const smsPreview = document.getElementById('smsPreview')
const smsCharCount = document.getElementById('smsCharCount')
const smsMessageInput = document.getElementById('smsMessage')

// Store current calculation results for email/SMS
let currentResults = null
let currentPropertyValue = null

// Add event listeners
calculateButton.addEventListener('click', calculateFees)
propertyValueInput.addEventListener('input', () => {
  if (propertyValueInput.value) {
    calculateFees()
  }
})
firstHomeBuyerCheckbox.addEventListener('change', calculateFees)
principalPlaceCheckbox.addEventListener('change', calculateFees)

// Email modal event listeners
closeEmailModalButton.addEventListener('click', closeEmailModal)
cancelEmail.addEventListener('click', closeEmailModal)
emailForm.addEventListener('submit', handleEmailSubmit)

// SMS modal event listeners
closeSmsModal.addEventListener('click', closeSmsModalFunc)
cancelSms.addEventListener('click', closeSmsModalFunc)
smsForm.addEventListener('submit', handleSmsSubmit)
smsMessageInput.addEventListener('input', updateSmsPreview)

// Close modals when clicking outside
emailModal.addEventListener('click', (e) => {
  if (e.target === emailModal) {
    closeEmailModal()
  }
})

smsModal.addEventListener('click', (e) => {
  if (e.target === smsModal) {
    closeSmsModalFunc()
  }
})

function calculateFees() {
  const propertyValue = parseFloat(propertyValueInput.value)
  
  if (!propertyValue || propertyValue <= 0) {
    resultsDiv.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
        <div class="text-center text-red-500">
          <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p>Please enter a valid property value</p>
        </div>
      </div>
    `
    return
  }

  const isFirstHomeBuyer = firstHomeBuyerCheckbox.checked
  const isPrincipalPlace = principalPlaceCheckbox.checked

  const results = calculator.calculate(propertyValue, isFirstHomeBuyer, isPrincipalPlace)
  
  // Store results for email/SMS functionality
  currentResults = results
  currentPropertyValue = propertyValue
  
  renderResults(results, propertyValue)
}

function renderResults(results, propertyValue) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const exemptionText = results.exemption ? 
    `<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-green-800 mb-2">Exemption Applied</h4>
      <p class="text-green-700">${results.exemption}</p>
    </div>` : ''

  const concessionText = results.concession ? 
    `<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-blue-800 mb-2">Concession Applied</h4>
      <p class="text-blue-700">${results.concession}</p>
      <p class="text-sm text-blue-600 mt-1">Savings: ${formatCurrency(results.savings)}</p>
    </div>` : ''

  const discountText = results.discount ? 
    `<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-yellow-800 mb-2">Discount Applied</h4>
      <p class="text-yellow-700">${results.discount}</p>
      <p class="text-sm text-yellow-600 mt-1">Savings: ${formatCurrency(results.savings)}</p>
    </div>` : ''

  resultsDiv.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Calculation Results</h3>
      
      ${exemptionText}
      ${concessionText}
      ${discountText}
      
      <div class="space-y-3">
        <div class="flex justify-between items-center py-2 border-b border-gray-200">
          <span class="text-gray-700">Property Value:</span>
          <span class="font-semibold">${formatCurrency(propertyValue)}</span>
        </div>
        
        <div class="flex justify-between items-center py-2 border-b border-gray-200">
          <span class="text-gray-700">Stamp Duty:</span>
          <span class="font-semibold text-blue-600">${formatCurrency(results.stampDuty)}</span>
        </div>
        
        <div class="flex justify-between items-center py-2 border-b border-gray-200">
          <span class="text-gray-700">Titles Office Fee:</span>
          <span class="font-semibold">${formatCurrency(results.titlesOfficeFee)}</span>
        </div>
        
        <div class="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
          <span class="text-lg font-bold text-gray-900">Total Fees:</span>
          <span class="text-xl font-bold text-green-600">${formatCurrency(results.total)}</span>
        </div>
      </div>
      
      <!-- Share Buttons -->
      <div class="mt-6 grid grid-cols-2 gap-3">
        <button
          id="emailResultsButton"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          Email Results
        </button>
        
        <button
          id="smsResultsButton"
          class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          Send SMS
        </button>
      </div>
      
      <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This calculator provides estimates based on current Victorian government rates. 
          Actual fees may vary. Please consult with a conveyancer or solicitor for precise calculations.
        </p>
      </div>
    </div>
  `

  // Add event listeners to the share buttons
  const emailButton = document.getElementById('emailResultsButton')
  const smsButton = document.getElementById('smsResultsButton')
  
  emailButton.addEventListener('click', openEmailModal)
  smsButton.addEventListener('click', openSmsModal)
}

function openEmailModal() {
  emailModal.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
}

function closeEmailModal() {
  emailModal.classList.add('hidden')
  document.body.style.overflow = 'auto'
}

function openSmsModal() {
  smsModal.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
  updateSmsPreview() // Initialize preview
}

function closeSmsModalFunc() {
  smsModal.classList.add('hidden')
  document.body.style.overflow = 'auto'
}

function handleEmailSubmit(e) {
  e.preventDefault()
  
  const recipientEmail = document.getElementById('recipientEmail').value
  const senderName = document.getElementById('senderName').value
  const subject = document.getElementById('emailSubject').value
  const additionalMessage = document.getElementById('emailMessage').value
  
  if (!recipientEmail) {
    alert('Please enter a recipient email address.')
    return
  }
  
  // Generate email content
  const emailContent = generateEmailContent(currentResults, currentPropertyValue, senderName, additionalMessage)
  
  // Create mailto link
  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`
  
  // Open email client
  window.location.href = mailtoLink
  
  // Close modal
  closeEmailModal()
  
  // Reset form
  emailForm.reset()
  document.getElementById('emailSubject').value = 'Stamp Duty Calculation Results'
}

function handleSmsSubmit(e) {
  e.preventDefault()
  
  const recipientPhone = document.getElementById('recipientPhone').value
  const additionalMessage = document.getElementById('smsMessage').value
  
  if (!recipientPhone) {
    alert('Please enter a recipient phone number.')
    return
  }
  
  // Generate SMS content
  const smsContent = generateSmsContent(currentResults, currentPropertyValue, additionalMessage)
  
  // Create SMS link (works on mobile devices)
  const smsLink = `sms:${recipientPhone}?body=${encodeURIComponent(smsContent)}`
  
  // Open SMS app
  window.location.href = smsLink
  
  // Close modal
  closeSmsModalFunc()
  
  // Reset form
  smsForm.reset()
  updateSmsPreview()
}

function updateSmsPreview() {
  const additionalMessage = smsMessageInput.value
  const smsContent = generateSmsContent(currentResults, currentPropertyValue, additionalMessage)
  
  smsPreview.textContent = smsContent
  smsCharCount.textContent = smsContent.length
  
  // Update character count color based on length
  if (smsContent.length > 160) {
    smsCharCount.className = 'text-red-600 font-semibold'
  } else if (smsContent.length > 140) {
    smsCharCount.className = 'text-yellow-600 font-semibold'
  } else {
    smsCharCount.className = 'text-gray-500'
  }
}

function generateEmailContent(results, propertyValue, senderName, additionalMessage) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const isFirstHomeBuyer = firstHomeBuyerCheckbox.checked
  const isPrincipalPlace = principalPlaceCheckbox.checked

  let content = `Bay City Conveyancing - Stamp Duty Calculation Results\n`
  content += `=====================================================\n\n`
  
  if (senderName) {
    content += `From: ${senderName}\n\n`
  }
  
  if (additionalMessage) {
    content += `${additionalMessage}\n\n`
  }
  
  content += `PROPERTY DETAILS:\n`
  content += `Property Value: ${formatCurrency(propertyValue)}\n`
  content += `First Home Buyer: ${isFirstHomeBuyer ? 'Yes' : 'No'}\n`
  content += `Principal Place of Residence: ${isPrincipalPlace ? 'Yes' : 'No'}\n\n`
  
  content += `CALCULATION RESULTS:\n`
  content += `Stamp Duty: ${formatCurrency(results.stampDuty)}\n`
  content += `Titles Office Fee: ${formatCurrency(results.titlesOfficeFee)}\n`
  content += `Total Fees: ${formatCurrency(results.total)}\n\n`
  
  if (results.exemption) {
    content += `EXEMPTION APPLIED:\n${results.exemption}\n\n`
  }
  
  if (results.concession) {
    content += `CONCESSION APPLIED:\n${results.concession}\n`
    content += `Savings: ${formatCurrency(results.savings)}\n\n`
  }
  
  if (results.discount) {
    content += `DISCOUNT APPLIED:\n${results.discount}\n`
    content += `Savings: ${formatCurrency(results.savings)}\n\n`
  }
  
  content += `DISCLAIMER:\n`
  content += `This calculator provides estimates based on current Victorian government rates. `
  content += `Actual fees may vary. Please consult with a conveyancer or solicitor for precise calculations.\n\n`
  
  content += `Brought to you by Bay City Conveyancing, the market leader in professional property conveyancing\n`
  content += `Bay City Conveyancing - For all residential sales and purchasers\n`
  content += `www.bayconvey.com.au\n`
  content += `For all other property matters-commercial, industrial, adverse possession, subdivisions and more, Bay City Legal www.baycitylegal.com.au`
  
  return content
}

function generateSmsContent(results, propertyValue, additionalMessage) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  let content = ''
  
  if (additionalMessage) {
    content += `${additionalMessage}\n\n`
  }
  
  content += `Bay City Conveyancing - Stamp Duty Results:\n`
  content += `Property: ${formatCurrency(propertyValue)}\n`
  content += `Stamp Duty: ${formatCurrency(results.stampDuty)}\n`
  content += `Titles Fee: ${formatCurrency(results.titlesOfficeFee)}\n`
  content += `Total: ${formatCurrency(results.total)}`
  
  if (results.savings > 0) {
    content += `\nSavings: ${formatCurrency(results.savings)}`
  }
  
  content += `\n\nBrought to you by Bay City Conveyancing, the market leader in professional property conveyancing\n`
  content += `Bay City Conveyancing - For all residential sales and purchasers\n`
  content += `www.bayconvey.com.au\n`
  content += `For all other property matters-commercial, industrial, adverse possession, subdivisions and more, Bay City Legal www.baycitylegal.com.au`
  
  return content
}