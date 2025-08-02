$("#m12").on("click", function( event ) {
    event.preventDefault();
    m12_full();
});

$("#main_content").on("keyup","#cashback_percentage_from", function() {
    get_debit_cards(1);
});
$("#main_content").on("keyup","#cashback_percentage_to", function() {
    get_debit_cards(1);
});
$("#main_content").on("keyup","#maintenance_cost_from", function() {
    get_debit_cards(1);
});
$("#main_content").on("keyup","#maintenance_cost_to", function() {
    get_debit_cards(1);
});
$("#main_content").on("change", "#category_var", function( event ) {
    event.preventDefault();
    get_debit_cards(1);
});
$("#main_content").on("change", "#sort_column", function( event ) {
    event.preventDefault();
    get_debit_cards(1);
});
$("#main_content").on("change", "#sort_type", function( event ) {
    event.preventDefault();
    get_debit_cards(1);
});



$("#main_content").on("change", "#name", function( event ) {
    event.preventDefault();
    get_currensies();
});



$("#main_content").on("submit", "#exc_cur", function( event ) {
    event.preventDefault();
    set_course();
});



function set_course(){
    $.ajax( {
        type: 'POST',
        url: 'queries/set_course.php',
        data: {
          name:$("#name").val(),
          Exchange_rate_new:$("#Exchange_rate_new").val()
        },
        dataType: 'text'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#Exchange_rate_this').val('');
        $('#Exchange_rate_this').val(data);
        $('#message_2').empty();
        $('#message_2').append('<div style="color:#ffe41c;">Новый курс успешно установлен</div>');
        get_debit_cards(0);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}







function get_currensies(){
    $.ajax( {
        type: 'POST',
        url: 'queries/exchange_rate.php',
        data: {
          name:$("#name").val()
        },
        dataType: 'text'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#Exchange_rate_this').val('');
        $('#Exchange_rate_this').val(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}



function m12_full(){
    $('#main_content').empty();
    filtr_form();
}

function filtr_form(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/select_currencies.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(form_filtr(parse_json_select(data)));
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h3>Динамика курса доллара США, за 1 USD</h3>
                    </div>
                    <div id="all_debit_cards"></div>
                </div>
        </div>`);
        get_debit_cards(0);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}




function get_debit_cards(a){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/dynamiccourse.php',
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#all_debit_cards').empty();
        $('#all_debit_cards').append(parse_json(data));
        
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}






function form_sort_column(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/sort_column.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#sort_column').append(parse_json_select_3(data));
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}




function form_filtr(select){
    return `
    <h1 class="title">Курсы валют</h1>
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h3>Форма установки размера курса валют</h3>
                </div>
                <div class="conteiner-form">
                    <div class="findent">
                    <form id="exc_cur" class="form_filtr" action="#">
                        <div class="form first">
                            <div class="details ID">
                                <span class="title">Установите новый курс</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Новый курс</label>
                                        <input id="Exchange_rate_new" type="text" placeholder="">
                                    </div>
                                    <div class="input-field">
                                        <label>Тип валюты</label>
                                        <select id="name">
                                            <option disabled selected>Выберите тип валюты</option>`
                                            +select+
                                        `</select>
                                    </div>
                                    <div class="input-field">
                                        <label>Действующий курс</label>
                                        <input id="Exchange_rate_this" type="text" placeholder="" readonly>
                                    </div>
                                </div><br/>
                            </div>
                            <div class="details ID">
                            <button class="nextBtn">
                                <span class="btnText">Установить</span>
                            </button>
                            </div>
                        </form>
                        <div id="message_2" style="text-align:center;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}





function parse_json_select_2(data){
    var option = '';

    $(data).each(function(index, element) { 
        option += '<option value="'+ element[0] + '">' + element[0] + '</option>';
    });
    
    return option;
}
function parse_json_select_3(data){
    var option = '';

    $(data[0]).each(function(index, element) { 
        option += '<option value="'+ element + '">' + element + '</option>';
    });
    
    return option;
}