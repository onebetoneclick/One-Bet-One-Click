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

const form =
document.getElementById("registerForm");

const email =
document.getElementById("email");

const phone =
document.getElementById("phone");

const bank =
document.getElementById("bank");

const accountNumber =
document.getElementById("accountNumber");

const verifyBtn =
document.getElementById("verifyBtn");

const registerBtn =
document.getElementById("registerBtn");

const verifiedCard =
document.getElementById("verifiedCard");

const summaryCard =
document.getElementById("summaryCard");

const accountName =
document.getElementById("accountName");

const fullName =
document.getElementById("fullName");

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
INITIAL STATE
==================================================
*/

verifiedCard.style.display="none";

summaryCard.style.display="none";

registerBtn.style.display="none";

/*
==================================================
LOAD BANKS
==================================================
*/

async function loadBanks(){

try{

const response =
await fetch(

API+"/bank/list"

);

const result =
await response.json();

bank.innerHTML =

`<option value="">Select Bank</option>`;

if(result.success){

result.data.forEach(item=>{

bank.innerHTML +=

`

<option
value="${item.code}">

${item.name}

</option>

`;

});

}

}catch(error){

console.log(error);

showMessage(

"error",

"Unable to load banks."

);

}

}

loadBanks();

console.log(
"Wallet Register Loaded Successfully."
);
/*
==================================================
VERIFY ACCOUNT
==================================================
*/

verifyBtn.addEventListener("click", async () => {

    hideMessage();

    verifiedCard.style.display = "none";

    summaryCard.style.display = "none";

    registerBtn.style.display = "none";

    /*
    ==========================================
    VALIDATION
    ==========================================
    */

    if (

        email.value.trim() === "" ||

        phone.value.trim() === "" ||

        bank.value === "" ||

        accountNumber.value.trim() === ""

    ) {

        showMessage(

            "error",

            "Please complete all fields."

        );

        return;

    }

    showLoading();

    try {

        const response = await fetch(

            API + "/wallet/check-account",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    account_number:
                    accountNumber.value.trim(),

                    bank_code:
                    bank.value

                })

            }

        );

        const result = await response.json();

        hideLoading();

        if (!response.ok) {

            showMessage(

                "error",

                result.message ||

                "Unable to verify account."

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
        ACCOUNT VERIFIED
        ==========================================
        */

        fullName.value =
        result.data.account_name;

        accountName.innerHTML =
        result.data.account_name;

        verifiedCard.style.display =
        "block";

        /*
        ==========================================
        SUMMARY
        ==========================================
        */

        summaryName.innerHTML =
        result.data.account_name;

        summaryEmail.innerHTML =
        email.value.trim();

        summaryPhone.innerHTML =
        phone.value.trim();

        summaryAccount.innerHTML =
        accountNumber.value.trim();

        summaryBank.innerHTML =
        bank.options[
            bank.selectedIndex
        ].text;

        summaryCard.style.display =
        "block";

        registerBtn.style.display =
        "block";

        showMessage(

            "success",

            "Account verified successfully."

        );

    }

    catch (error) {

        hideLoading();

        console.log(error);

        showMessage(

            "error",

            "Unable to connect to server."

        );

    }

});
/*
==================================================
REGISTER USER
==================================================
*/

registerBtn.addEventListener("click", async () => {

    hideMessage();

    showLoading();

    try {

        const response = await fetch(

            API + "/auth/register",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: email.value.trim(),

                    phone: phone.value.trim(),

                    full_name: fullName.value.trim(),

                    account_number: accountNumber.value.trim(),

                    bank_code: bank.value

                })

            }

        );

        const result = await response.json();

        hideLoading();

        if (!response.ok) {

            showMessage(

                "error",

                result.message || "Registration failed."

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
SAVE DETAILS
==========================================
*/

sessionStorage.setItem(
    "wallet_email",
    email.value.trim()
);

sessionStorage.setItem(
    "wallet_phone",
    phone.value.trim()
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
    "wallet_user_id",
    result.data.user_id
);

sessionStorage.setItem(
    "wallet_account_number",
    accountNumber.value.trim()
);

sessionStorage.setItem(
    "wallet_bank_code",
    bank.value
);

sessionStorage.setItem(
    "wallet_bank_name",
    bank.options[bank.selectedIndex].text
);

        /*
        ==========================================
        SUCCESS
        ==========================================
        */

        showMessage(

            "success",

            result.message

        );

        /*
        ==========================================
        GO TO OTP PAGE
        ==========================================
        */

        setTimeout(() => {

            window.location.href =

            "verify-email.html";

        }, 1500);

    }

    catch (error) {

        hideLoading();

        console.log(error);

        showMessage(

            "error",

            "Unable to connect to server."

        );

    }

});