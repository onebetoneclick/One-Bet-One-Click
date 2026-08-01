/*
==================================================
CONFIG
==================================================
*/

const API =
"https://wallet-5lpb.onrender.com/api";

/*
==================================================
ELEMENTS
==================================================
*/

const loading =
document.getElementById("loading");

const userName =
document.getElementById("userName");

const walletBalance =
document.getElementById("walletBalance");

const walletID =
document.getElementById("walletID");

const accountNumber =
document.getElementById("accountNumber");

const accountName =
document.getElementById("accountName");

const bankName =
document.getElementById("bankName");

const toggleBalance =
document.getElementById("toggleBalance");

const refreshWallet =
document.getElementById("refreshWallet");

const copyAccount =
document.getElementById("copyAccount");

const toast =
document.getElementById("toast");

const toastMessage =
document.getElementById("toastMessage");

/*
==================================================
HELPERS
==================================================
*/

function showLoading(){

loading.style.display="flex";

}

function hideLoading(){

loading.style.display="none";

}

function showToast(text){

toast.style.display="flex";

toastMessage.innerHTML=text;

setTimeout(()=>{

toast.style.display="none";

},3000);

}

function formatMoney(amount){

return new Intl.NumberFormat(

"en-NG",

{

style:"currency",

currency:"NGN"

}

).format(amount || 0);

}

/*
==================================================
CHECK LOGIN
==================================================
*/

const walletEmail =
sessionStorage.getItem("wallet_email");

if(!walletEmail){

window.location.href="wallet-register.html";

}

/*
==================================================
BALANCE VISIBILITY
==================================================
*/

let balanceVisible = true;

let currentBalance = 0;

console.log("Dashboard Started Successfully");
/*
==================================================
LOAD DASHBOARD
==================================================
*/

async function loadDashboard(){

showLoading();

try{

const response = await fetch(

API + "/wallet/existing-wallet",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email:walletEmail

})

}

);

const result = await response.json();

hideLoading();

if(!response.ok){

showToast(

result.message ||

"Unable to load dashboard."

);

return;

}

if(!result.success){

showToast(

result.message

);

return;

}


/*
==================================================
SAVE SESSION
==================================================
*/

sessionStorage.setItem(

"wallet_user_id",

result.data.user_id

);

sessionStorage.setItem(

"wallet_email",

result.data.email

);

sessionStorage.setItem(

"wallet_phone",

result.data.phone

);

sessionStorage.setItem(

"wallet_full_name",

result.data.full_name

);

sessionStorage.setItem(

"wallet_first_name",

result.data.first_name

);

sessionStorage.setItem(

"wallet_last_name",

result.data.last_name

);

sessionStorage.setItem(

"wallet_customer_code",

result.data.customer_code

);

sessionStorage.setItem(

"wallet_account_number",

result.data.account_number

);

sessionStorage.setItem(

"wallet_account_name",

result.data.account_name

);

sessionStorage.setItem(

"wallet_bank_name",

result.data.bank_name

);

sessionStorage.setItem(

"wallet_balance",

result.data.balance

);

sessionStorage.setItem(

"wallet_currency",

result.data.currency

);

sessionStorage.setItem(

"wallet_activated",

result.data.wallet_activated

);

/*
==================================================
DISPLAY
==================================================
*/

currentBalance =

Number(result.data.balance);

userName.innerHTML =

result.data.full_name;

walletBalance.innerHTML =

formatMoney(currentBalance);

walletID.innerHTML =

result.data.customer_code;

accountNumber.innerHTML =

result.data.account_number;

accountName.innerHTML =

result.data.account_name;

bankName.innerHTML =

result.data.bank_name;

console.log(

"Dashboard Loaded",

result.data

);

}

catch(error){

hideLoading();

console.log(error);

showToast(

"Unable to connect to server."

);

}

}

/*
==================================================
LOAD NOW
==================================================
*/

loadDashboard();
/*
==================================================
SHOW / HIDE BALANCE
==================================================
*/

toggleBalance.addEventListener("click",()=>{

balanceVisible = !balanceVisible;

if(balanceVisible){

walletBalance.innerHTML =

formatMoney(currentBalance);

toggleBalance.innerHTML =

'<i class="fas fa-eye"></i>';

}else{

walletBalance.innerHTML =

"₦ ••••••••";

toggleBalance.innerHTML =

'<i class="fas fa-eye-slash"></i>';

}

});

/*
==================================================
REFRESH WALLET
==================================================
*/

refreshWallet.addEventListener("click",()=>{

showToast("Refreshing Wallet...");

loadDashboard();

});

/*
==================================================
COPY ACCOUNT NUMBER
==================================================
*/

copyAccount.addEventListener("click",()=>{

navigator.clipboard.writeText(

accountNumber.innerHTML

);

showToast(

"Account Number Copied"

);

});

/*
==================================================
NOTIFICATION
==================================================
*/

const notificationBtn =
document.getElementById("notificationBtn");

const notificationModal =
document.getElementById("notificationModal");

const closeNotification =
document.getElementById("closeNotification");

notificationBtn.addEventListener("click",()=>{

notificationModal.style.display="flex";

});

closeNotification.addEventListener("click",()=>{

notificationModal.style.display="none";

});

window.addEventListener("click",(e)=>{

if(e.target===notificationModal){

notificationModal.style.display="none";

}

});

/*
==================================================
BOTTOM NAVIGATION
==================================================
*/

document.querySelectorAll(

".bottomNav a"

).forEach(item=>{

item.addEventListener("click",()=>{

document.querySelectorAll(

".bottomNav a"

).forEach(link=>{

link.classList.remove("active");

});

item.classList.add("active");

});

});

/*
==================================================
COMING SOON
==================================================
*/

document.querySelectorAll(

".comingSoon"

).forEach(button=>{

button.addEventListener("click",(e)=>{

e.preventDefault();

showToast(

"This feature is coming soon."

);

});

});

/*
==================================================
LOGOUT
==================================================
*/

function logout(){

if(

confirm(

"Do you want to logout?"

)

){

sessionStorage.clear();

window.location.href=

"wallet-register.html";

}

}

/*
==================================================
AUTO REFRESH
==================================================
*/

setInterval(()=>{

if(

sessionStorage.getItem(

"wallet_email"

)

){

loadDashboard();

}

},30000);

/*

==================================================
WELCOME
==================================================
*/

window.addEventListener("load",()=>{

const name =

sessionStorage.getItem(

"wallet_full_name"

);

if(name){

showToast(

"Welcome back, " +

name

);

}

});

console.log(

"Dashboard Ready Successfully."

);
const withdrawBtn = document.getElementById("withdrawBtn");

console.log(withdrawBtn);

if (withdrawBtn) {

    withdrawBtn.addEventListener("click", () => {

        console.log("Withdraw button clicked");

        window.location.href = "withdraw.html";

    });

}