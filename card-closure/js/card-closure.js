$(document).ready(function(){
var isAddonGlobal = false;

//=========Code Custom Select box ===============================
var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select-reusable");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    selElmnt.parentElement.id;
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /* For each option in the original select element,
         create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        // add additional parameteres based on specific select
        switch (selElmnt.parentElement.id) {
            case "reason-select":
                c.setAttribute("data-next", 'step-' + selElmnt.options[j].value);
                c.setAttribute("data-current", 'step2'); 
                break;
        
            default:
                break;
        }
        
        c.addEventListener("click", function (e) {
            /* When an item is clicked, update the original select box,
             and the selected item: */
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    // call function to change step based on selection.
                    switch (this.parentElement.parentElement.id) {
                        case "reason-select":
                            removeOpenedSteps();
                            document.querySelector('#step2 .select-selected').setAttribute("data-next", this.dataset.next);
                            document.querySelector('#step2 .select-selected').setAttribute("data-current", 'step2'); 
                            document.querySelector('textarea.others-text').value ='';
                            document.querySelector('#reason-select-button').classList.remove('disabled') 
                            resetTermsCheckbox();

                            if(this.dataset.next == 'step-other'){
                                $('.select-reson-cnt.others').show();
                                $('#reason-select-button').addClass('disabled')
                            }else{
                                $('#reason-select-button').removeClass('disabled')
                                $('.select-reson-cnt.others').hide();
                            }
                            break;
                        case "new-billing-cycle-select":
                            $('#cycle-change-confirm').removeClass('disabled')
                            break;
                        case "fee-waiver-select":
                            $('#fee-waiver-confirm').removeClass('disabled');
                            break;
                        default:
                            break;
                    }
                    
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /* When the select box is clicked, close any other select boxes,
         and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");

    });
}
})

function displaySelection(step,selectionText){
    switch (step) {
        case 'step1':
            $('.main-wrap#step1 .sub-heading ').text(selectionText)
            break;
        case 'step2':
            $('.main-wrap#step2 .sub-heading').text(selectionText)
            $('#closure-readon').text(selectionText)
            break;
    
        default:
            break;
    }
}
function removeOpenedSteps(){
    $('.main-wrap.my-profile.step-3-wrapp').removeClass('filled');    
    $('.main-wrap.my-profile.step-3-wrapp').removeClass('active');   
    $('.main-wrap.my-profile.step-3-wrapp').addClass('hidden');   
    $('.main-wrap.my-profile.step-4-wrapp').removeClass('filled');    
    $('.main-wrap.my-profile.step-4-wrapp').removeClass('active');   
    $('.main-wrap.my-profile.step-4-wrapp').addClass('hidden');
    $('.main-wrap.my-profile.step-5-wrapp').removeClass('filled');    
    $('.main-wrap.my-profile.step-5-wrapp').removeClass('active');   
    $('.main-wrap.my-profile.step-5-wrapp').addClass('hidden');   
}
// action taken can be 'avail' or 'skip'
let activeStepsArray = [
    {
        id:'step1',
        actionTaken:'avail'
    },
    {
        id:'step2',
        actionTaken:'avail',
        reason:''
    },
];
function removeStepsAfter(index){
    for (let i = index+1; i < activeStepsArray.length; i++) {
            const step = activeStepsArray[i];
            resetThisStep(step.id);
    }
    activeStepsArray.splice(index+1);
}
function assignActionToStep(step,action){
    const alreadyAssignedAction = activeStepsArray.find(a => a.id == step).actionTaken;
    if(alreadyAssignedAction != '' && alreadyAssignedAction!=action){
        // definite change in flow
        const indexForStepChange = activeStepsArray.indexOf(activeStepsArray.find(a => a.id == step));
        removeStepsAfter(indexForStepChange);
    }
    // assign correct action
    activeStepsArray.find(a => a.id == step).actionTaken = action;    
}
function pushIfNew(step,action){
    const indexForStepChange = activeStepsArray.indexOf(activeStepsArray.find(a => a.id == step));
    if(indexForStepChange<0){
        activeStepsArray.push({id:step,actionTaken:action});
    }else{
    }
}
function resetThisStep(step){
    switch (step) {
        case 'unusual':
            
            break;
    
        default:
            document.querySelector('#'+step).classList.remove('filled');
            document.querySelector('#'+step).classList.remove('active');
            // document.querySelector('#'+step).classList.remove('paused');
            document.querySelector('#'+step).classList.add('hidden')
            break;
    }
}
function showNextStep(nextStep,currentStep,isAddon) {

    if(isAddon!=undefined) isAddonGlobal = isAddon;
    
    // hide other steps of 3rd category
    const nextStepDashIndex = nextStep.indexOf('-')
    if(nextStep.substr(0,nextStepDashIndex) == 'step3'){        
        $('.main-wrap.step-3-wrapp.active').addClass('hidden');
        $('.main-wrap.step-3-wrapp.active').removeClass('active');
    }

    // hide current Step if it exists
    // expect when others i,e. step3-6 is chosen
    if(nextStep != "step3-6"){
        $('.select-reson-cnt.others').hide();
    }
    if(currentStep){
        $('.main-wrap.my-profile#'+currentStep).addClass('filled');    
        $('.main-wrap.my-profile#'+currentStep).removeClass('active');
        $('.select-reson-cnt.others').hide();    
    }
    // make next step active
    $('.main-wrap.my-profile.hidden#'+nextStep).removeClass('hidden');
    $('.main-wrap.my-profile.paused#'+nextStep).removeClass('paused');
    $('.main-wrap.my-profile#'+nextStep).addClass('active');
    $('.main-wrap.my-profile#'+nextStep).find(".mumer-heading").addClass("toggle");
    // currentStepIndex++;
    // document.querySelector('.main-wrap.my-profile#'+nextStep).dataset.step = currentStepIndex;
    // document.querySelector('.main-wrap.my-profile#'+nextStep +' .number-count.numeric').innerHTML = currentStepIndex;
    // activeSteps[activeSteps.length-1].innerHTML = parseInt(lastFilledStep[lastFilledStep.length-1].innerHTML) + 1;
    var target = $(this.hash);
    target = target.length ? target : $('#' + nextStep);
    if (target.length) {
        $('html,body').animate({
            scrollTop: (target.offset().top - 110)
        });
        return false;
    }
    
}

var currentStepIndex = 1;
function handleStepChangeFrom(step,isAvail,currentStepOverride){
    // based on where the avail or skip is clicked from, called different functions/process
       
    switch (step) {
        case 'step1':
            const selectCardType = $('input[name=card-group]:checked').val();
            showNextStep('step2','step1',selectCardType === 'addon')
            if(selectCardType === 'addon'){
                const selectedAddonCard = document.querySelector('#step1 .select-selected');
                displaySelection("step1","Add On Card: " + selectedAddonCard.innerHTML);
            }else{
                // handle card number properly hard coding here
                displaySelection("step1","Primary Card: " + "XXXX-2345");
            }
            removeStepsAfter(1);
            $('#step1 .collapse-content.show').removeClass('show')
            $('#step1').find(".sub-heading").show();
            $('#reason-select select').prop('selectedIndex',0)
            $('#step2 .select-selected').text('Select')
            $('#step2').removeClass('filled')
            break;
        case 'step2':
            const selectedReason = document.querySelector('#step2 .select-selected');            
            removeStepsAfter(1);
            displaySelection("step2",selectedReason.innerHTML);
            if(isAddonGlobal){      
                showNextStep('step3-addon',selectedReason.dataset.current);          
                activeStepsArray.push({id:'step3-addon',actionTaken:''});
                $('#step2 .collapse-content.show').removeClass('show')
                $('#step2').find(".sub-heading").show();
                $('#step-other-offers .step-title').text('Other Offers'); 
            }
            else if(selectedReason.dataset.next == 'step-other'){
                if(document.querySelector('textarea.others-text').value.length>3){
                    showNextStep('step-other-offers',selectedReason.dataset.current);
                    $('[name=more-offers-radio]:checked').prop('checked',false)
                    activeStepsArray.push({id:'step-other-offers',actionTaken:''})
                    $('#step2 .collapse-content.show').removeClass('show')
                    $('#step2').find(".sub-heading").show();
                    $('#step-other-offers .step-title').text('Other Offers'); 
                }
            }
            else if(selectedReason.dataset.next == 'step-no-offers'){
                showNextStep('step-other-offers',selectedReason.dataset.current);
                $('[name=more-offers-radio]:checked').prop('checked',false)
                activeStepsArray.push({id:'step-other-offers',actionTaken:''})
                $('#step2 .collapse-content.show').removeClass('show')
                $('#step2').find(".sub-heading").show();
                changeNumberOnActiveStep()
                $('#step-other-offers .step-title').text('Some Offers For You');
            }
            else{
                showNextStep(selectedReason.dataset.next,selectedReason.dataset.current);
                activeStepsArray.push({id:selectedReason.dataset.next,actionTaken:''})
                $('#step2 .collapse-content.show').removeClass('show')
                $('#step2').find(".sub-heading").show();
                $('#step-other-offers .step-title').text('Other Offers'); 
            }
            activeStepsArray.find(a => a.id == 'step2').reason = selectedReason.dataset.next.substr(5);
            changeNumberOnActiveStep()
            break;
        case 'step-annual-fee':
            // case of Annual Fee Waiver
            if(isAvail){
                assignActionToStep('step-annual-fee','avail')
                window.location.href = "./success-sr-fees.html"
                break;
            }
            // showNextStep('step-other-offers',currentStepOverride?currentStepOverride:'step3-1');
            assignActionToStep('step-annual-fee','skip')
            pushIfNew('step-other-offers','')
            showNextStep('step-other-offers','step-annual-fee');
            $('[name=more-offers-radio]:checked').prop('checked',false)
            $('#step-annual-fee .collapse-content.show').removeClass('show')
            changeNumberOnActiveStep()
            break;
        case 'step-low-credit':
            // case of Low Credit Limit
            if(isAvail){
                assignActionToStep('step-low-credit','avail')
                $('#redirect-modal').show();
                break;
            }
            assignActionToStep('step-low-credit','skip')
            pushIfNew('step-other-offers','')
            showNextStep('step-other-offers','step-low-credit');
            $('[name=more-offers-radio]:checked').prop('checked',false)
            $('#step-low-credit .collapse-content.show').removeClass('show')
            break;            
        case 'step-billing-cycle':
            $('#step-billing-cycle .collapse-content.show').removeClass('show')
            if(isAvail){
                // showNextStep('step4-3',currentStepOverride?currentStepOverride:'step3-3');
                assignActionToStep('step-billing-cycle','avail')
                pushIfNew('step-change-billing-cycle','')
                showNextStep('step-change-billing-cycle','step-billing-cycle')
                break
            }
            assignActionToStep('step-billing-cycle','skip')
            pushIfNew('step-other-offers','')
            showNextStep('step-other-offers','step-billing-cycle');
            $('[name=more-offers-radio]:checked').prop('checked',false)
            // case of Change Billing Cycle
            break;
        case 'step-no-offers':
            // case of no Offers
            // show step 4 of more offers
            showNextStep('step-other-offers','step-no-offers');
            $('[name=more-offers-radio]:checked').prop('checked',false)
            changeNumberOnActiveStep()            
            break;
        case 'step-other-fees':
            $('#step-other-fees .collapse-content.show').removeClass('show')
            // case of other fees and charges
            // show step 4 of more offers
            if(isAvail){
                assignActionToStep('step-other-fees','avail')
                pushIfNew('step-request-fee-waiver','')
                // showNextStep('step4-5',currentStepOverride?currentStepOverride:'step3-5');            
                showNextStep('step-request-fee-waiver','step-other-fees');            
                break
            }
            assignActionToStep('step-other-fees','skip')
            pushIfNew('step-other-offers','')
            showNextStep('step-other-offers','step-other-fees');   
            $('[name=more-offers-radio]:checked').prop('checked',false)
            break;
        // case 'step-other':
        //     if(isAvail){
        //         const selectedOffer = $('input[name="some-offers-radio"]:checked').val();
        //         handleOfferSelection(selectedOffer)
        //         changeNumberOnActiveStep()
        //         break;
        //     }
        //     showNextStep('step4-others','step3-6');
        //     break;
        case 'step-low-credit-usage':
            // case of low card usage
            if(isAvail){
                assignActionToStep('step-low-credit-usage','avail')
                break
            }
            assignActionToStep('step-low-credit-usage','skip')
            pushIfNew('step-other-offers','')
            showNextStep('step-other-offers','step-low-credit-usage');
            // $('.main-wrap.paused').removeClass('paused');
            changeNumberOnActiveStep();
            $('[name=more-offers-radio]:checked').prop('checked',false)
            $('#step-low-credit-usage .collapse-content.show').removeClass('show')
            break;
        case 'step-other-offers':
            // case for step 4 More offers in  "no offers"
            if(isAvail){
                const selectedOffer = $('input[name="more-offers-radio"]:checked').val();
                handleOfferSelection(selectedOffer)
                break;
            }
            // write what else happens here
            pushIfNew('step-confirm','')
            assignActionToStep('step-other-offers','skip');
            showNextStep('step-confirm','step-other-offers');
            // $('.main-wrap.paused').removeClass('paused');
            $('#step-other-offers .collapse-content.show').removeClass('show');
            resetTermsCheckbox()
            changeNumberOnActiveStep()            
            break;
        // case 'step4-3':
        //     // case for step 4 change billing cycle in  "billing cycle issues."
            
        //     // write what else happens here
        //     showNextStep('step-confirm','step4-3');
        //     resetTermsCheckbox()
        //     break;
        case 'step3-addon':
            // case for confirm for add on
            if(isAvail){
                assignActionToStep('step3-addon','avail')
                break
            }
            // write what else happens here
            assignActionToStep('step3-addon','skip');
            pushIfNew('step-addon-confirm','')
            showNextStep('step-addon-confirm','step3-addon');
            // $('.main-wrap.paused').removeClass('paused');
            $('#step3-addon .collapse-content.show').removeClass('show');
            break;
        
        default:
            break;
    }
    console.table(activeStepsArray);   
}

function resetTermsCheckbox() {
    document.querySelector('#step-confirm .e-sign-button').classList.add('disabled')
    // document.querySelector('#step-confirm-others .e-sign-button').classList.add('disabled')
    document.querySelector('#terms-form-confirm-4 .e-sign-button').classList.add('disabled')
    document.querySelector('#step-confirm #terms_conditions_confirm').checked = false;
    // document.querySelector('#step-confirm-others #terms_conditions_step4').checked = false;
    document.querySelector('#terms-form-confirm-4 input').checked = false;
    $('.gray-otp-wrapp').hide();
    $('.main-wrap.active .sbi-input-checkbox').removeClass('untouchable');
    $('.tick-buttons-block').show();
}
function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
     except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}
function changeNumberOnActiveStep(){
    const activeSteps = document.querySelectorAll('.main-wrap.my-profile.active .number-count.numeric');
    const lastFilledStep = document.querySelectorAll('.main-wrap.my-profile.filled .number-count.numeric');
    activeSteps[activeSteps.length-1].innerHTML = parseInt(lastFilledStep[lastFilledStep.length-1].innerHTML) + 1;
}
function validateOTP(el){
    if (el.value.length > el.maxLength) {
        el.value = el.value.slice(0, el.maxLength);
    }else if(el.value.length==6) {
        $('.otp-submit-block .blue-btn.disabled').removeClass('disabled');
    }else {
        $('.otp-submit-block .blue-btn').addClass('disabled') ;
    }
}
function handleOfferSelection(selection){
    switch (selection) {
        case "annual-fee-waiver":
            pushIfNew('step-annual-fee','')
            window.location.href = "./success-sr-fees.html"
            break;
        case "fee-reversal":
            assignActionToStep('step-other-offers','avail')
            pushIfNew('step-request-fee-waiver','')         
            showNextStep('step-request-fee-waiver','step-other-offers');    
            $('#step-other-offers .collapse-content.show').removeClass('show');  
            // make it step 5 in html
            changeNumberOnActiveStep()
            break;
        case "credit-limit-increase":
            assignActionToStep('step-other-offers','avail') 
            $('#redirect-modal').show();
            break;
        case "get-reward-points":
            assignActionToStep('step-other-offers','avail') 
            window.location.href = "./success-sr-fees.html"
            break;
        case "change-billing-cycle":
            assignActionToStep('step-other-offers','avail') 
            pushIfNew('step-change-billing-cycle','');
            showNextStep('step-change-billing-cycle','step-other-offers');
            $('#step-other-offers .collapse-content.show').removeClass('show');
            changeNumberOnActiveStep(5)
            break;
        case "card-features-and-offers":
            assignActionToStep('step-other-offers','avail') 
            window.location.href = "./success-sr-fees.html"
            break;
        default:
            break;
    }
}

/* If the user clicks anywhere outside the select box,
 then close all select boxes: */
document.addEventListener("click", closeAllSelect);
