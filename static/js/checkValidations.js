const userLoginFormValidation = () => {
    const email = document.forms["user-login-form"]["email"].value;
    const password = document.forms["user-login-form"]["password"].value;

    if (email === "") {
       alert("Email field cannot be empty.");
    }
    else {
        document.getElementById("emailErr").innerHTML = "";

    }

    if (password === "") {
        alert( "Password field cannot be empty.");
    }
    else {
        document.getElementById("passwordErr").innerHTML = "";

    }
} 


//registration form validation

function validateForm() {
    let name = document.forms["registrationForm"]["name"].value;
    let email = document.forms["registrationForm"]["email"].value;
    let number = document.forms["registrationForm"]["number"].value;
    let addressline1 = document.forms["registrationForm"]["addressline1"].value;
    let addressline2 = document.forms["registrationForm"]["addressline2"].value;
    let city = document.forms["registrationForm"]["city"].value;
    let state = document.forms["registrationForm"]["state"].value;
    let country = document.forms["registrationForm"]["country"].value;
    let zipcode = document.forms["registrationForm"]["zipcode"].value;
    let password = document.forms["registrationForm"]["password"].value;
    let confirmPassword = document.forms["registrationForm"]["confirmPassword"].value;

    if (name === "") {
        document.getElementById("nameErr").innerHTML = "Pleaes enter your name.";
        return false;
    } else {
        document.getElementById("nameErr").innerHTML = "";
    }

    if (email == "") {
        document.getElementById("emailErr").innerHTML = "Please enter your email.";

        return false;
    }
    else
    {
        document.getElementById("emailErr").innerHTML = "";
    }

    if (number == "") {
        document.getElementById("numberErr").innerHTML =
            "Please enter your number.";

        return false;
    }
    else
    {
        document.getElementById("numberErr").innerHTML = "";
    }

    if (addressline1 == "") {
        document.getElementById("address1Err").innerHTML =
            "Address field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("address1Err").innerHTML = "";
    }

    if (addressline2 == "") {
        document.getElementById("address2Err").innerHTML =
            "Address field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("address2Err").innerHTML = "";
    }

    if (city == "") {
        document.getElementById("cityErr").innerHTML = "City field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("cityErr").innerHTML = "";
    }

    if (state == "") {
        document.getElementById("stateErr").innerHTML =
            "State field can't be empty";

        return false;
    }
    else
    {
        document.getElementById("stateErr").innerHTML = "";
    }

    if (country == "") {
        document.getElementById("countryErr").innerHTML =
            "Country field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("countryErr").innerHTML = "";
    }
    if (zipcode == "") {
        document.getElementById("zipcodeErr").innerHTML =
            "Zipcode field can't be empty.";

        return false;
    }
    else
    {
        document.getElementById("zipcodeErr").innerHTML = "";
    }
    if (password != confirmPassword) {
        document.getElementById("confirmpasswordErr").innerHTML =
            "Your password does not match.";

        return false;
    }
    else
    {
        document.getElementById("confirmpasswordErr").innerHTML = "";
    }

    if (password == "") {
        document.getElementById("passwordErr").innerHTML =
            "Please enter your Password.";

        return false;
    }
    else
    {
        document.getElementById("passwordErr").innerHTML = "";
    }
}

//upadte poassword function
const ChangeUserPasswordFormValidations = () => {
    const email = document.forms["ChangeUserPasswordForm"]["email"].value;
    const password = document.forms["ChangeUserPasswordForm"]["password"].value;
    const confirmPassword = document.forms["ChangeUserPasswordForm"]["confirmPassword"].value;


    if (email === "") {

        document.getElementById("emailErr").innerHTML = "Email field can not be empty.";
        return false;

    } else {
        document.getElementById("emailErr").innerHTML = "";

    }
    if (confirmPassword != password) {
        document.getElementById(passwordErr).innerHTML = "Your passsword does not match.";
    }

    if (password === "") {

        document.getElementById("passwordErr").innerHTML = "Password field can not be empty.";
        return false;

    } else {
        document.getElementById("passwordErr").innerHTML = "";

    }

    if (confirmPassword === "") {

        document.getElementById("confirmPasswordErr").innerHTML = "Please confirm your password.";
        return false;

    } else {
        document.getElementById("confirmPasswordErr").innerHTML = "";

    }

}

