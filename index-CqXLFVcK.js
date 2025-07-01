(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function n(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(e){if(e.ep)return;e.ep=!0;const a=n(e);fetch(e.href,a)}})();class C{constructor(){this.stampDutyRates=[{min:0,max:25e3,rate:.014,base:0},{min:25001,max:13e4,rate:.024,base:350},{min:130001,max:96e4,rate:.06,base:2870},{min:960001,max:2e6,rate:.055,base:0},{min:2000001,max:1/0,rate:.065,base:11e4}],this.pprRates=[{min:0,max:25e3,rate:.014,base:0},{min:25001,max:13e4,rate:.024,base:350},{min:130001,max:44e4,rate:.05,base:2870},{min:440001,max:55e4,rate:.06,base:18370}],this.titlesOfficeBaseFee=101.5,this.titlesOfficeRatePerThousand=2.34,this.titlesOfficeMaxFee=3611,this.fhbFullExemptionLimit=6e5,this.fhbConcessionLimit=75e4,this.pprDiscountLimit=55e4}calculateTitlesOfficeFee(t){const n=Math.floor(t/1e3),i=this.titlesOfficeBaseFee+n*this.titlesOfficeRatePerThousand;return Math.min(i,this.titlesOfficeMaxFee)}calculateStampDuty(t,n=!1){const i=n?this.pprRates:this.stampDutyRates;for(const e of i)if(t>=e.min&&t<=e.max){if(e.min===960001)return t*e.rate;if(e.min===2000001)return e.base+(t-2e6)*e.rate;{const a=t-(e.min-1);return e.base+a*e.rate}}return 0}calculatePrincipalResidenceDiscount(t){if(t>this.pprDiscountLimit)return{stampDuty:this.calculateStampDuty(t,!1),discount:null,savings:0};const n=this.calculateStampDuty(t,!0),e=this.calculateStampDuty(t,!1)-n;if(e>0){let a="Principal Place of Residence rates applied.";return t>13e4&&t<=44e4?a+=" Reduced rate of 5% (instead of 6%) for amounts between $130,001 - $440,000.":t>44e4&&t<=55e4?a+=" Special calculation: $18,370 + 6% for amounts between $440,001 - $550,000.":t>13e4&&(a+=" Reduced rates applied for eligible brackets."),{stampDuty:n,discount:a,savings:e}}return{stampDuty:n,discount:null,savings:0}}calculateFirstHomeBuyerBenefit(t){const n=this.calculateStampDuty(t);if(t<=this.fhbFullExemptionLimit)return{stampDuty:0,exemption:`Full stamp duty exemption applied for first home buyers on properties up to $${this.fhbFullExemptionLimit.toLocaleString()}.`,concession:null,discount:null,savings:n};if(t<=this.fhbConcessionLimit){const i=t-this.fhbFullExemptionLimit,e=this.fhbConcessionLimit-this.fhbFullExemptionLimit,a=i/e,l=n*a,o=n-l;return{stampDuty:Math.max(0,l),exemption:null,concession:`First home buyer concession applied for properties between $${(this.fhbFullExemptionLimit+1).toLocaleString()} and $${this.fhbConcessionLimit.toLocaleString()}.`,discount:null,savings:o}}return this.calculatePrincipalResidenceDiscount(t)}calculate(t,n=!1,i=!1){let e;n?e=this.calculateFirstHomeBuyerBenefit(t):i?e=this.calculatePrincipalResidenceDiscount(t):e={stampDuty:this.calculateStampDuty(t),exemption:null,concession:null,discount:null,savings:0},e.exemption||(e.exemption=null),e.concession||(e.concession=null),e.discount||(e.discount=null);const a=this.calculateTitlesOfficeFee(t),l=e.stampDuty+a;return{...e,titlesOfficeFee:a,total:l}}}function M(){return`
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
  `}document.querySelector("#app").innerHTML=M();const D=new C,g=document.getElementById("propertyValue"),v=document.getElementById("firstHomeBuyer"),x=document.getElementById("principalPlace"),F=document.getElementById("calculateButton"),w=document.getElementById("results"),c=document.getElementById("emailModal"),P=document.getElementById("closeEmailModal"),L=document.getElementById("cancelEmail"),$=document.getElementById("emailForm"),d=document.getElementById("smsModal"),k=document.getElementById("closeSmsModal"),I=document.getElementById("cancelSms"),E=document.getElementById("smsForm"),R=document.getElementById("smsPreview"),r=document.getElementById("smsCharCount"),S=document.getElementById("smsMessage");let u=null,m=null;F.addEventListener("click",p);g.addEventListener("input",()=>{g.value&&p()});v.addEventListener("change",p);x.addEventListener("change",p);P.addEventListener("click",f);L.addEventListener("click",f);$.addEventListener("submit",T);k.addEventListener("click",b);I.addEventListener("click",b);E.addEventListener("submit",N);S.addEventListener("input",h);c.addEventListener("click",s=>{s.target===c&&f()});d.addEventListener("click",s=>{s.target===d&&b()});function p(){const s=parseFloat(g.value);if(!s||s<=0){w.innerHTML=`
      <div class="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
        <div class="text-center text-red-500">
          <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p>Please enter a valid property value</p>
        </div>
      </div>
    `;return}const t=v.checked,n=x.checked,i=D.calculate(s,t,n);u=i,m=s,j(i,s)}function j(s,t){const n=y=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",minimumFractionDigits:2,maximumFractionDigits:2}).format(y),i=s.exemption?`<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-green-800 mb-2">Exemption Applied</h4>
      <p class="text-green-700">${s.exemption}</p>
    </div>`:"",e=s.concession?`<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-blue-800 mb-2">Concession Applied</h4>
      <p class="text-blue-700">${s.concession}</p>
      <p class="text-sm text-blue-600 mt-1">Savings: ${n(s.savings)}</p>
    </div>`:"",a=s.discount?`<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-yellow-800 mb-2">Discount Applied</h4>
      <p class="text-yellow-700">${s.discount}</p>
      <p class="text-sm text-yellow-600 mt-1">Savings: ${n(s.savings)}</p>
    </div>`:"";w.innerHTML=`
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Calculation Results</h3>
      
      ${i}
      ${e}
      ${a}
      
      <div class="space-y-3">
        <div class="flex justify-between items-center py-2 border-b border-gray-200">
          <span class="text-gray-700">Property Value:</span>
          <span class="font-semibold">${n(t)}</span>
        </div>
        
        <div class="flex justify-between items-center py-2 border-b border-gray-200">
          <span class="text-gray-700">Stamp Duty:</span>
          <span class="font-semibold text-blue-600">${n(s.stampDuty)}</span>
        </div>
        
        <div class="flex justify-between items-center py-2 border-b border-gray-200">
          <span class="text-gray-700">Titles Office Fee:</span>
          <span class="font-semibold">${n(s.titlesOfficeFee)}</span>
        </div>
        
        <div class="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
          <span class="text-lg font-bold text-gray-900">Total Fees:</span>
          <span class="text-xl font-bold text-green-600">${n(s.total)}</span>
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
  `;const l=document.getElementById("emailResultsButton"),o=document.getElementById("smsResultsButton");l.addEventListener("click",A),o.addEventListener("click",O)}function A(){c.classList.remove("hidden"),document.body.style.overflow="hidden"}function f(){c.classList.add("hidden"),document.body.style.overflow="auto"}function O(){d.classList.remove("hidden"),document.body.style.overflow="hidden",h()}function b(){d.classList.add("hidden"),document.body.style.overflow="auto"}function T(s){s.preventDefault();const t=document.getElementById("recipientEmail").value,n=document.getElementById("senderName").value,i=document.getElementById("emailSubject").value,e=document.getElementById("emailMessage").value;if(!t){alert("Please enter a recipient email address.");return}const a=H(u,m,n,e),l=`mailto:${t}?subject=${encodeURIComponent(i)}&body=${encodeURIComponent(a)}`;window.location.href=l,f(),$.reset(),document.getElementById("emailSubject").value="Stamp Duty Calculation Results"}function N(s){s.preventDefault();const t=document.getElementById("recipientPhone").value,n=document.getElementById("smsMessage").value;if(!t){alert("Please enter a recipient phone number.");return}const i=B(u,m,n),e=`sms:${t}?body=${encodeURIComponent(i)}`;window.location.href=e,b(),E.reset(),h()}function h(){const s=S.value,t=B(u,m,s);R.textContent=t,r.textContent=t.length,t.length>160?r.className="text-red-600 font-semibold":t.length>140?r.className="text-yellow-600 font-semibold":r.className="text-gray-500"}function H(s,t,n,i){const e=y=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",minimumFractionDigits:2,maximumFractionDigits:2}).format(y),a=v.checked,l=x.checked;let o=`Bay City Conveyancing - Stamp Duty Calculation Results
`;return o+=`=====================================================

`,n&&(o+=`From: ${n}

`),i&&(o+=`${i}

`),o+=`PROPERTY DETAILS:
`,o+=`Property Value: ${e(t)}
`,o+=`First Home Buyer: ${a?"Yes":"No"}
`,o+=`Principal Place of Residence: ${l?"Yes":"No"}

`,o+=`CALCULATION RESULTS:
`,o+=`Stamp Duty: ${e(s.stampDuty)}
`,o+=`Titles Office Fee: ${e(s.titlesOfficeFee)}
`,o+=`Total Fees: ${e(s.total)}

`,s.exemption&&(o+=`EXEMPTION APPLIED:
${s.exemption}

`),s.concession&&(o+=`CONCESSION APPLIED:
${s.concession}
`,o+=`Savings: ${e(s.savings)}

`),s.discount&&(o+=`DISCOUNT APPLIED:
${s.discount}
`,o+=`Savings: ${e(s.savings)}

`),o+=`DISCLAIMER:
`,o+="This calculator provides estimates based on current Victorian government rates. ",o+=`Actual fees may vary. Please consult with a conveyancer or solicitor for precise calculations.

`,o+=`Brought to you by Bay City Conveyancing, the market leader in professional property conveyancing
`,o+=`Bay City Conveyancing - For all residential sales and purchasers
`,o+=`www.bayconvey.com.au
`,o+="For all other property matters-commercial, industrial, adverse possession, subdivisions and more, Bay City Legal www.baycitylegal.com.au",o}function B(s,t,n){const i=a=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",minimumFractionDigits:0,maximumFractionDigits:0}).format(a);let e="";return n&&(e+=`${n}

`),e+=`Bay City Conveyancing - Stamp Duty Results:
`,e+=`Property: ${i(t)}
`,e+=`Stamp Duty: ${i(s.stampDuty)}
`,e+=`Titles Fee: ${i(s.titlesOfficeFee)}
`,e+=`Total: ${i(s.total)}`,s.savings>0&&(e+=`
Savings: ${i(s.savings)}`),e+=`

Brought to you by Bay City Conveyancing, the market leader in professional property conveyancing
`,e+=`Bay City Conveyancing - For all residential sales and purchasers
`,e+=`www.bayconvey.com.au
`,e+="For all other property matters-commercial, industrial, adverse possession, subdivisions and more, Bay City Legal www.baycitylegal.com.au",e}
