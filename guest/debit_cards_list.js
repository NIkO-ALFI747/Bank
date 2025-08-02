$(document).ready(function(){
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


$("#main_content").on("submit", "#customer", function( event ) {
    event.preventDefault();
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: '../admin/vendor/customer_reg.php',
        data: {
        name: $("#name").val(),
        surname: $("#surname").val(),
        patronymic: $("#patronymic").val(),
        gender: $("#gender").val(),
        date_of_birth: $("#date_of_birth").val(),
        passport_series: $("#passport_series").val(),
        passport_number: $("#passport_number").val(),
        date_of_issue: $("#date_of_issue").val(),
        phone_number: $("#phone_number").val(),
        email: $("#email").val(),
        country: $("#country").val(),
        city: $("#city").val(),
        street: $("#street").val(),
        house: $("#house").val(),
        flat: $("#flat").val(),
        work_experience: $("#work_experience").val(),
        income: $("#income").val(),
        abbreviation_currency: $("#abbreviation_currency").val(),
        login: $("#login").val(),
        password: $("#password").val()
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        form_customer_card($("#ID_debit_card").val(), data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
});




function m12_full(){
    $('#main_content').empty();
    filtr_form();
}

function filtr_form(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: '../admin/queries/m12_category_var.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(form_filtr(parse_json_select_2(data)));
        form_sort_column();
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Дебетовые карты</h5>
                    </div><br/>
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
        url: '../admin/queries/get_debit_cards.php',
        data: {
            flag:a,
            cashback_percentage_from:$("#cashback_percentage_from").val(),
            cashback_percentage_to:$("#cashback_percentage_to").val(),
            maintenance_cost_from:$("#maintenance_cost_from").val(),
            maintenance_cost_to:$("#maintenance_cost_to").val(),
            category_var:$("#category_var").val(),
            sort_column:$("#sort_column").val(),
            sort_type:$("#sort_type").val()
        }
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
        url: '../admin/queries/sort_column.php'
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
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h5>Форма фильтрации</h5>
                </div>
                <div class="conteiner-form">
                    <div class="findent">
                    <form id="employee_edit" class="form_filtr" action="#">
                        <div class="form first">
                            <div class="details ID">
                                <span class="title">Фильтр</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Размер кэшбека</label>
                                        <input id="cashback_percentage_from" type="number" placeholder="От">
                                    </div>
                                    <div class="input-field">
                                        <label>Размер кэшбека</label>
                                        <input id="cashback_percentage_to" type="number" placeholder="До">
                                    </div>
                                    <div class="input-field"></div>
                                </div><hr class="hr">
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Стоимость обслуживания</label>
                                        <input id="maintenance_cost_from" type="number" placeholder="От">
                                    </div>
                                    <div class="input-field">
                                        <label>Стоимость обслуживания</label>
                                        <input id="maintenance_cost_to" type="number" placeholder="До">
                                    </div>
                                    <div class="input-field">
                                        <label>Тип категории</label>
                                        <select id="category_var">
                                            <option disabled selected>Выберите тип категории</option>
                                            <option value="ALL">Любой</option>`
                                            +select+
                                        `</select>
                                    </div>
                                </div><br/>
                            </div>
                            <div class="details ID">
                                <span class="title">Сортировка</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Сортируемый столбец</label>
                                        <select id="sort_column">
                                            <option disabled selected>Выберите название столбца</option>
                                        </select>
                                    </div>
                                    <div class="input-field">
                                        <label>Тип сортировки</label>
                                        <select id="sort_type">
                                            <option disabled selected>Выберите тип сортировки</option>
                                            <option value="DESC">По убыванию</option>
                                            <option value="ASC">По возрастанию</option>
                                        </select>
                                    </div>
                                    <div class="input-field"></div>
                                </div>
                            </div>
                        </form>
                        <div id="message_2" style="text-align:center;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function form_customer(id){
    $('#main_content').empty();
    var addDays = 1;
    var now=new Date();
    now.setMonth(now.getMonth()+ addDays);
    $('#main_content').append(`
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h5>Регистрация клиента</h5>
                </div>
                <div class="conteiner-form">
                    <div class="findent">
                    <form id="customer" class="form_cs" action="#">
                        <div class="form first">
                            <input id="ID_debit_card" type="hidden" value="`+id+`">
                            <div class="details personal">
                                <span class="title">Личные данные</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Имя</label>
                                        <input id="name" type="text" placeholder="Александр" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Фамилия</label>
                                        <input id="surname" type="text" placeholder="Александров" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Отчество</label>
                                        <input id="patronymic" type="text" placeholder="Александрович" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Пол</label>
                                        <select id="gender" required>
                                            <option disabled selected>Выберите пол</option>
                                            <option>М</option>
                                            <option>Ж</option>
                                        </select>
                                    </div>
                                    <div class="input-field">
                                        <label>Дата рождения</label>
                                        <input id="date_of_birth" type="date" min="1900-01-01" max="`+ now.getFullYear() +`-0`+ now.getMonth() +`-`+ now.getDate() +`" required>
                                    </div>
                                    <div class="input-field"></div>
                                </div><hr class="hr">
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Серия паспорта</label>
                                        <input id="passport_series" type="text" placeholder="4123" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер паспорта</label>
                                        <input id="passport_number" type="text" placeholder="123456" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Дата выдачи паспорта</label>
                                        <input id="date_of_issue" type="date" min="1900-01-01" max="`+ now.getFullYear() +`-0`+ now.getMonth() +`-`+ now.getDate() +`" required>
                                    </div>
                                </div><hr class="hr">
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер телефона</label>
                                        <input id="phone_number" type="text" placeholder="7(310)566-68-49" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Email</label>
                                        <input id="email" type="email" placeholder="test@gmail.com" required>
                                    </div>
                                    <div class="input-field"></div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Данные адреса</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Страна</label>
                                        <input id="country" type="text" placeholder="США" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Город</label>
                                        <input id="city" type="text" placeholder="North Carolina" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Улица</label>
                                        <input id="street" type="text" placeholder="Powell Hills" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Дом</label>
                                        <input id="house" type="text" placeholder="17" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Квартира</label>
                                        <input id="flat" type="text" placeholder="57" required>
                                    </div>
                                    <div class="input-field"></div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Данные о карьере</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Опыт работы</label>
                                        <input id="work_experience" type="number" placeholder="Количество лет">
                                    </div>
                                    <div class="input-field">
                                        <label>Размер дохода</label>
                                        <input id="income" type="number" placeholder="50000">
                                    </div>
                                    <div class="input-field">
                                        <label>Тип валюты</label>
                                        <select id="abbreviation_currency">
                                            <option disabled selected>Выберите валюту</option>
                                            <option>RUB</option>
                                            <option>USD</option>
                                            <option>EUR</option>
                                        </select>
                                    </div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Учетные данные</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Логин</label>
                                        <input id="login" type="text" placeholder="customer123" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Пароль</label>
                                        <input id="password" type="password" placeholder="123abc123" required>
                                    </div>
                                    <div class="input-field"></div>
                                </div>
                                <button class="nextBtn">
                                    <span class="btnText">Далее</span>
                                </button>
                            </div>
                            <div id="message" style="text-align:center;"></div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function form_customer_card(ID_card, ID_customer){
    $('#main_content').empty();
    var addDays = 1;
    var now=new Date();
    now.setMonth(now.getMonth()+ addDays);
    $('#main_content').append(`
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h5>Оформление дебетовой карты клиента</h5>
                </div>
                <div class="conteiner-form">
                    <div class="find_card">
                    <form id="customer_card" class="form_card" action="#">
                        <div class="form first">
                            <input id="ID_debit_card" type="hidden" value="`+ID_card+`">
                            <input id="ID_customer" type="hidden" value="`+ID_customer+`">
                            <div class="details personal">
                                <span class="title">Данные карты</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер карты</label>
                                        <input id="Number" type="text" placeholder="5000001234567905" required>
                                    </div>
                                    <div class="input-field">
                                        <label>CVV код</label>
                                        <input id="CVV" type="text" placeholder="017" required>
                                    </div>
                                    <div class="input-field">
                                        <label>PIN код</label>
                                        <input id="PIN" type="text" placeholder="0017" required>
                                    </div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Данные счёта</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер счета в валюте RUB</label>
                                        <input id="Account_number_rub" type="text" placeholder="0004016" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер счета в валюте USD</label>
                                        <input id="Account_number_usd" type="text" placeholder="0004017" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер счета в валюте EUR</label>
                                        <input id="Account_number_eur" type="text" placeholder="0004018" required>
                                    </div>
                                </div>
                                <button class="nextBtn">
                                    <span class="btnText">Зарегистрировать</span>
                                </button>
                            </div>
                            <div id="message" style="text-align:center;"></div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    `);
}



function get_customer_id (id){
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/customer_id.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        form_open_card(id, data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}

function parse_json (data) {
    var table = '<table>';
    var thead = '<thead><tr>';
    var i = 0; var j=0;
  
    $(data[0]).each(function(ind_cell, val_cell) { 
        if (i > 0){
          thead += "<th>" + val_cell + "</th>";
        }
      i++;
    });
  
    thead += '<th>Оформление</th></tr></thead>';
    table += thead;
    var row = '<tbody>';
    var col = '';
    i = 0;
    
    $(data).each(function(index, element) { 
      if (i > 0){
        row += '<tr>';
        col = '';
        j=0;
        $(element).each(function(ind_cell, val_cell) {
            if(j>0){
                col += "<td><p>" + val_cell + "</p></td>";
            }
          j++;
        })

        col += `
        <td style="margin-right: 15px;">
            <a href='javascript:void(0)' onclick='regData_cs(` + data[index][0] + `)'>Оформить</a>
        </td>
        `;

        row += col;
        row += '</tr>';
      }
      i++;
    });
    
    row += '</tbody>';
    table += row;
    table += '</table>';
    return table;
}

var regData_cs = function(id){
    form_customer(id);
};

function form_open_card(ID_card, data){
    $('#main_content').empty();
    $('#main_content').append(`
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h5>Оформление дебетовой карты клиента</h5>
                </div>
                <div class="conteiner-form">
                    <div class="find_card">
                    <form id="customer_card" class="form_card" action="#">
                        <div class="form first">
                            <input id="ID_debit_card" type="hidden" value="`+ID_card+`">
                            <input id="ID_customer" type="hidden" value="`+data+`">
                            <div class="details personal">
                                <span class="title">Данные карты</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер карты</label>
                                        <input id="Number" type="text" placeholder="5000001234567905" required>
                                    </div>
                                    <div class="input-field">
                                        <label>CVV код</label>
                                        <input id="CVV" type="text" placeholder="017" required>
                                    </div>
                                    <div class="input-field">
                                        <label>PIN код</label>
                                        <input id="PIN" type="text" placeholder="0017" required>
                                    </div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Данные счёта</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер счета в валюте RUB</label>
                                        <input id="Account_number_rub" type="text" placeholder="0004016" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер счета в валюте USD</label>
                                        <input id="Account_number_usd" type="text" placeholder="0004017" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер счета в валюте EUR</label>
                                        <input id="Account_number_eur" type="text" placeholder="0004018" required>
                                    </div>
                                </div>
                                <button class="nextBtn">
                                    <span class="btnText">Зарегистрировать</span>
                                </button>
                            </div>
                            <div id="message" style="text-align:center;"></div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    `);
}

$("#main_content").on("submit", "#customer_card", function( event ) {
    event.preventDefault();
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: '../admin/vendor/customer_debit_card_reg.php',
        data: {
        ID_customer: $("#ID_customer").val(),
        ID_debit_card: $("#ID_debit_card").val(),
        Number: $("#Number").val(),
        CVV: $("#CVV").val(),
        PIN: $("#PIN").val(),
        Account_number_rub: $("#Account_number_rub").val(),
        Account_number_usd: $("#Account_number_usd").val(),
        Account_number_eur: $("#Account_number_eur").val()
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#message').empty();
        $('#message').append('<div style="color:#ffe41c;">Дебетовая карта успешно оформлена. Клиент успешно зарегистрирован.</div>');
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
});

function parse_json_select_2(data){
    var option = '';
    $(data).each(function(index, element) { 
        option += '<option value="'+ element[0] + '">' + element[0] + '</option>';
    });
    
    return option;
}
function parse_json_select_3(data){
    var option = '';
    var i=0;
    $(data[0]).each(function(index, element) { 
        if (i>0){
            option += '<option value="'+ element + '">' + element + '</option>';
        }
        i++;
    });
    
    return option;
}