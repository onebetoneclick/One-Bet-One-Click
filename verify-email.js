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

const userEmail =
document.getElementById("userEmail");

const verifyBtn =
document.getElementById("verifyBtn");

const resendBtn =
document.getElementById("resendBtn");

const timer =
document.getElementById("timer");

const countdown =
document.getElementById("countdown");

const loading =
document.getElementById("loading");

const message =
document.getElementById("message");

const otpInputs =
document.querySelectorAll(".otp");

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
LOAD EMAIL
==================================================
*/

const email =
sessionStorage.getItem("wallet_email");

if(!email){

alert("Registration session expired.");

window.location.href="wallet-register.html";

}

userEmail.innerHTML=email;

/*
==================================================
OTP AUTO FOCUS
==================================================
*/

otpInputs.forEach((input,index)=>{

input.addEventListener("input",()=>{

input.value=input.value.replace(/\D/g,"");

if(input.value.length===1 && index<otpInputs.length-1){

otpInputs[index+1].focus();

}

});

input.addEventListener("keydown",(e)=>{

if(

e.key==="Backspace"

&&

input.value===""

&&

index>0

){

otpInputs[index-1].focus();

}

});

});

/*
==================================================
GET OTP
==================================================
*/

function getOTP(){

let otp="";

otpInputs.forEach(input=>{

otp+=input.value;

});

return otp;

}
/*
==================================================
VERIFY EMAIL OTP
==================================================
*/

verifyBtn.addEventListener("click", async () => {

    hideMessage();

    const otp = getOTP();

    if (otp.length !== 6) {

        showMessage(
            "error",
            "Please enter the 6-digit OTP."
        );

        return;

    }

    showLoading();

    try {

        const response = await fetch(

            API + "/auth/verify-email",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: email,

                    token: otp

                })

            }

        );

        const result = await response.json();

        hideLoading();

        if (!response.ok) {

            showMessage(

                "error",

                result.message ||

                "OTP verification failed."

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
        SUCCESS
        ==========================================
        */

        showMessage(

            "success",

            "Email verified successfully."

        );

        /*
        ==========================================
        MARK EMAIL VERIFIED
        ==========================================
        */

        sessionStorage.setItem(

            "wallet_email_verified",

            "true"

        );

        /*
        ==========================================
        GO TO ACTIVATE WALLET
        ==========================================
        */

        setTimeout(() => {

            window.location.href =

            "activate-wallet.html";

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
/*
==================================================
RESEND OTP
==================================================
*/

let seconds = 60;

resendBtn.disabled = true;

function startCountdown(){

    seconds = 60;

    resendBtn.disabled = true;

    countdown.style.display = "block";

    timer.innerHTML = seconds;

    const interval = setInterval(()=>{

        seconds--;

        timer.innerHTML = seconds;

        if(seconds <= 0){

            clearInterval(interval);

            resendBtn.disabled = false;

            countdown.style.display = "none";

        }

    },1000);

}

/*
==================================================
START TIMER
==================================================
*/

startCountdown();

/*
==================================================
RESEND EMAIL OTP
==================================================
*/

resendBtn.addEventListener("click",async()=>{

    hideMessage();

    showLoading();

    try{

        const response = await fetch(

            API+"/auth/resend-otp",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    email:email

                })

            }

        );

        const result = await response.json();

        hideLoading();

        if(!response.ok){

            showMessage(

                "error",

                result.message ||

                "Unable to resend OTP."

            );

            return;

        }

        if(!result.success){

            showMessage(

                "error",

                result.message

            );

            return;

        }

        showMessage(

            "success",

            "A new OTP has been sent to your email."

        );

        startCountdown();

    }

    catch(error){

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
AUTO SUBMIT WHEN OTP IS COMPLETE
==================================================
*/

otpInputs.forEach(input=>{

    input.addEventListener("keyup",()=>{

        const otp = getOTP();

        if(otp.length===6){

            verifyBtn.click();

        }

    });

});

/*
==================================================
END
==================================================
*/

console.log(

"Verify Email Loaded Successfully."

);