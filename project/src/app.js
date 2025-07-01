export function renderApp() {
  return `
    <div class="min-h-screen bg-blue-600">
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-white mb-1">Bay City Conveyancing</h1>
            <h2 class="text-2xl font-semibold text-blue-100 mb-4">Stamp Duty Calculator</h2>
            <p class="text-lg text-blue-100">Calculate stamp duty and titles office fees for property purchases in Victoria, Australia</p>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <!-- Input Form -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-2xl font-semibold text-gray-900 mb-6">Property Details</h2>
              
              <div class="space-y-6">
                <div>
                  <label for="propertyValue" class="block text-sm font-medium text-gray-700 mb-2">
                    Property Value (AUD)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="propertyValue"
                      placeholder="600000"
                      class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="firstHomeBuyer"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="firstHomeBuyer" class="ml-3 text-sm font-medium text-gray-700">
                      First Home Buyer
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="principalPlace"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="principalPlace" class="ml-3 text-sm font-medium text-gray-700">
                      Principal Place of Residence
                    </label>
                  </div>
                </div>

                <button
                  id="calculateButton"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
                >
                  Calculate Fees
                </button>
              </div>

              <!-- Information Panel -->
              <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 class="font-semibold text-blue-900 mb-2">Available Discounts</h3>
                <ul class="text-sm text-blue-800 space-y-1">
                  <li>• <strong>First Home Buyer:</strong> Full exemption up to $600,000, concession up to $750,000 (automatically includes PPR rates)</li>
                  <li>• <strong>Principal Place of Residence:</strong> Reduced rates for $130k-$550k only</li>
                  <li>• <strong>Investment Properties:</strong> Full stamp duty applies</li>
                </ul>
              </div>
            </div>

            <!-- Results -->
            <div id="results">
              <div class="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
                <div class="text-center text-gray-500">
                  <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <p>Enter a property value to see the calculation</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Rate Information -->
          <div class="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Current Rates (2025)</h3>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-800 mb-3">Standard Stamp Duty Rates</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>$0 - $25,000:</span>
                    <span>1.4%</span>
                  </div>
                  <div class="flex justify-between">
                    <span>$25,001 - $130,000:</span>
                    <span>$350 + 2.4%</span>
                  </div>
                  <div class="flex justify-between">
                    <span>$130,001 - $960,000:</span>
                    <span>$2,870 + 6.0%</span>
                  </div>
                  <div class="flex justify-between">
                    <span>$960,001 - $2,000,000:</span>
                    <span>5.5%</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Over $2,000,000:</span>
                    <span>$110,000 + 6.5%</span>
                  </div>
                </div>
                
                <h4 class="font-semibold text-gray-800 mb-3 mt-6">Principal Place of Residence Rates</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span>$0 - $130,000:</span>
                    <span>Same as standard</span>
                  </div>
                  <div class="flex justify-between text-green-600 font-medium">
                    <span>$130,001 - $440,000:</span>
                    <span>$2,870 + 5.0%</span>
                  </div>
                  <div class="flex justify-between text-green-600 font-medium">
                    <span>$440,001 - $550,000:</span>
                    <span>$18,370 + 6.0%</span>
                  </div>
                  <div class="flex justify-between text-red-600 font-medium">
                    <span>$550,001+:</span>
                    <span>Standard rates apply</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-800 mb-3">Titles Office Fees</h4>
                <div class="space-y-2 text-sm">
                  <div class="text-gray-700">
                    <span>$101.50 + $2.34 per $1,000</span>
                  </div>
                  <div class="text-gray-700">
                    <span>Maximum fee: $3,611.00</span>
                  </div>
                </div>
                
                <h4 class="font-semibold text-gray-800 mb-3 mt-6">Discounts Available</h4>
                <div class="space-y-2 text-sm">
                  <div class="text-gray-700">
                    <span>First home buyer benefits up to $750,000</span>
                  </div>
                  <div class="text-gray-700">
                    <span>Principal residence reduced rates $130k-$550k only</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Email Modal -->
    <div id="emailModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Email Calculation Results</h3>
            <button id="closeEmailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form id="emailForm" class="space-y-4">
            <div>
              <label for="recipientEmail" class="block text-sm font-medium text-gray-700 mb-1">
                Recipient Email *
              </label>
              <input
                type="email"
                id="recipientEmail"
                required
                placeholder="client@example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label for="senderName" class="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="senderName"
                placeholder="Your Name"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label for="emailSubject" class="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="emailSubject"
                value="Stamp Duty Calculation Results"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label for="emailMessage" class="block text-sm font-medium text-gray-700 mb-1">
                Additional Message (Optional)
              </label>
              <textarea
                id="emailMessage"
                rows="3"
                placeholder="Add any additional notes or comments..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                id="cancelEmail"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- SMS Modal -->
    <div id="smsModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Send SMS Results</h3>
            <button id="closeSmsModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form id="smsForm" class="space-y-4">
            <div>
              <label for="recipientPhone" class="block text-sm font-medium text-gray-700 mb-1">
                Recipient Phone Number *
              </label>
              <input
                type="tel"
                id="recipientPhone"
                required
                placeholder="0412 345 678"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Enter Australian mobile number (e.g., 0412 345 678)</p>
            </div>
            
            <div>
              <label for="smsMessage" class="block text-sm font-medium text-gray-700 mb-1">
                Additional Message (Optional)
              </label>
              <textarea
                id="smsMessage"
                rows="2"
                placeholder="Add a personal note..."
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">Max 100 characters for personal message</p>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg">
              <h4 class="text-sm font-medium text-gray-700 mb-2">SMS Preview:</h4>
              <div id="smsPreview" class="text-sm text-gray-600 bg-white p-2 rounded border max-h-32 overflow-y-auto">
                <!-- SMS preview will be populated here -->
              </div>
              <p class="text-xs text-gray-500 mt-1">Character count: <span id="smsCharCount">0</span>/160</p>
            </div>
            
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                id="cancelSms"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send SMS
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
}