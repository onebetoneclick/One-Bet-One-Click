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

const summaryName =
document.getElementById("summaryName");

const summaryEmail =
document.getElementById("summaryEmail");

const summaryPhone =
document.getElementById("summaryPhone");

const summaryBank =
document.getElementById("summaryBank");

const summaryAccount =
document.getElementById("summaryAccount");

const bvn =
document.getElementById("bvn");

const activateBtn =
document.getElementById("activateBtn");

const loading =
document.getElementById("loading");

const message =
document.getElementById("message");

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

function showMessage(type,text){

message.style.display="block";

message.className="message "+type;

message.innerHTML=text;

}

function hideMessage(){

message.style.display="none";

}

/*
==================================================
LOAD USER DATA
==================================================
*/

const walletData = {

email:
sessionStorage.getItem("wallet_email"),

phone:
sessionStorage.getItem("wallet_phone"),

full_name:
sessionStorage.getItem("wallet_full_name"),

first_name:
sessionStorage.getItem("wallet_first_name"),

last_name:
sessionStorage.getItem("wallet_last_name"),

bank_code:
sessionStorage.getItem("wallet_bank_code"),

bank_name:
sessionStorage.getItem("wallet_bank_name"),

account_number:
sessionStorage.getItem("wallet_account_number")

};

/*
==================================================
CHECK SESSION
==================================================
*/

if(

!walletData.email ||

!walletData.account_number

){

alert(

"Registration session expired."

);

window.location.href=

"wallet-register.html";

}

/*
==================================================
DISPLAY SUMMARY
==================================================
*/

summaryName.innerHTML =
walletData.full_name;

summaryEmail.innerHTML =
walletData.email;

summaryPhone.innerHTML =
walletData.phone;

summaryBank.innerHTML =
walletData.bank_name;

summaryAccount.innerHTML =
walletData.account_number;

/*
==================================================
BVN VALIDATION
==================================================
*/

bvn.addEventListener("input",()=>{

bvn.value =
bvn.value.replace(/\D/g,"");

if(bvn.value.length>11){

bvn.value =
bvn.value.substring(0,11);

}

});

console.log(
"Activate Wallet Loaded."
);
/*
==================================================
ACTIVATE WALLET
==================================================
*/

activateBtn.addEventListener("click", async () => {

    hideMessage();

    /*
    ==========================================
    VALIDATE BVN
    ==========================================
    */

    if (bvn.value.trim().length !== 11) {

        showMessage(
            "error",
            "Please enter a valid 11-digit BVN."
        );

        return;

    }

    activateBtn.disabled = true;

    showLoading();

    try {

        const response = await fetch(

            API + "/wallet/activate",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email:
                    walletData.email,

                    first_name:
                    walletData.first_name,

                    last_name:
                    walletData.last_name,

                    phone:
                    walletData.phone,

                    bvn:
                    bvn.value.trim(),

                    account_number:
                    walletData.account_number,

                    bank_code:
                    walletData.bank_code

                })

            }

        );

        const result = await response.json();

        hideLoading();

        activateBtn.disabled = false;

        if (!response.ok) {

            showMessage(

                "error",

                result.message ||

                "Wallet activation failed."

            );

            return;

        }

        if (!result.success) {

            showMessage(

                "error",

                result.message

            );

            return;

        }

        /*
        ==========================================
        SAVE WALLET DETAILS
        ==========================================
        */

        sessionStorage.setItem(

            "wallet_customer_code",

            result.data.customer_code

        );

        sessionStorage.setItem(

            "wallet_account_name",

            result.data.account_name

        );

        sessionStorage.setItem(

            "wallet_account_number",

            result.data.account_number

        );

        sessionStorage.setItem(

            "wallet_bank_name",

            result.data.bank_name

        );

        sessionStorage.setItem(

            "wallet_activated",

            "true"

        );

        showMessage(

            "success",

            "Wallet activated successfully."

        );

        setTimeout(() => {

            // Redirect will be added in Part 3

        }, 1500);

    }

    catch (error) {

        console.log(error);

        hideLoading();

        activateBtn.disabled = false;

        showMessage(

            "error",

            "Unable to connect to server."

        );

    }

});
/*
==================================================
REDIRECT TO DASHBOARD
==================================================
*/

setTimeout(() => {

    /*
    ==========================================
    CLEAR TEMP REGISTRATION DATA
    ==========================================
    */

    sessionStorage.removeItem("wallet_first_name");

    sessionStorage.removeItem("wallet_last_name");

    sessionStorage.removeItem("wallet_full_name");

    sessionStorage.removeItem("wallet_bank_code");

    sessionStorage.removeItem("wallet_bank_name");

    /*
    ==========================================
    KEEP IMPORTANT DATA
    ==========================================
    */

    sessionStorage.setItem(

        "wallet_logged_in",

        "true"

    );

    /*
    ==========================================
    GO TO DASHBOARD
    ==========================================
    */

    window.location.href =

    "dashboard.html";

},1500);

/*
==================================================
PREVENT ACCESS WITHOUT REGISTRATION
==================================================
*/

window.addEventListener("load",()=>{

    if(

        !walletData.email ||

        !walletData.account_number

    ){

        window.location.href =

        "wallet-register.html";

    }

});

/*
==================================================
ALLOW ONLY NUMBERS FOR BVN
==================================================
*/

bvn.addEventListener("keypress",(e)=>{

    if(!/[0-9]/.test(e.key)){

        e.preventDefault();

    }

});

/*
==================================================
ENTER KEY SUPPORT
==================================================
*/

bvn.addEventListener("keydown",(e)=>{

    if(

        e.key==="Enter"

    ){

        e.preventDefault();

        activateBtn.click();

    }

});

/*
==================================================
END
==================================================
*/

console.log(

"Activate Wallet Ready."

);