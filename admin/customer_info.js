$("#info_customer").on("click", function( event ) {
    event.preventDefault();
    customer_info();
});

var deleteData_cs = function(id){
    $.ajax( {
      type: 'POST',
      url: 'vendor/customer_del.php',
      data:{
        deleteid:id
      },
      dataType: 'text'
    })
    .done(function (data, textStatus, jqXHR) { 
      customer_info();
      alert(data);
    })
    .fail(function (jqXHR,textStatus) {
      alert("При обращении к серверу возникли проблемы: " + textStatus);
    });
};

var editData_cs = function(id){
    form_customer_ch(id);
};

$("#main_content").on("submit", "#customer_edit", function( event ) {
    event.preventDefault();
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/customer_edit.php',
        data:{
            editid:$("#editid").val(),
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
        if (data=='0'){
            $('#message').empty();
            $('#message').append('<div style="color:#ffe41c;">Дата рождения должна быть меньше даты выдачи паспорта</div>');
        } else {
            customer_info();
            alert("Запись о клиенте с номером " + data + " успешно изменена");
        }
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
});



function customer_info () {
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/customer_info.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').empty();
        $('#main_content').append(`
            <h1 class="title">Сведения о клиентах</h1>
            
            <div class="table-data">
                <div class="order">
                    <div id="all_customer_accounts">` + parse_json_ch_cs(data) + `</div>
                </div>
            </div>
        `);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}

function parse_json_ch_cs (data) {
    var table = '<table>';
    var thead = '<thead><tr>';
    var i = 0;
  
    $(data[0]).each(function(ind_cell, val_cell) { 
      thead += "<th>" + val_cell + "</th>";
      i++;
    });

    thead += '<th>Операции</th></tr></thead>';
    table += thead;
    var row = '<tbody>';
    var col = '';
    i = 0;
    
    $(data).each(function(index, element) { 
      if (i > 0){
        row += '<tr>';
        col = '';
  
        $(element).each(function(ind_cell, val_cell) {
          col += "<td><p>" + val_cell + "</p></td>";
        })
  
        col += `
        <td class="edit" style="margin-right: 15px;">
            <div class="edit-d">
                <a href='javascript:void(0)' onclick='editData_cs(` + data[index][0] + `)'><i class='bx bxs-edit'></i></a>
            </div>
            <div class="delete-d">
                <a href='javascript:void(0)' onclick='deleteData_cs(` + data[index][0] + `)'><i class='bx bxs-trash-alt'></i></a>
            </div>
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

function form_customer_ch(id){
    
    $('#main_content').empty();

    var addDays = 1;
    var now=new Date();
    now.setMonth(now.getMonth()+ addDays);
    $('#main_content').append(`
        <h1 class="title">Форма изменения данных клиента</h1>
        
        <div class="table-data">
			<div class="order">
                <div class="conteiner-form">
                    <div class="findent">
                    <form id="customer_edit" class="form_cs" action="#">
                        <div class="form first">
                            <input id="editid" type="hidden" value="`+ id +`">
                            <div class="details personal">
                                <span class="title">Личные данные</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Имя</label>
                                        <input id="name" type="text" placeholder="Александр">
                                    </div>
                                    <div class="input-field">
                                        <label>Фамилия</label>
                                        <input id="surname" type="text" placeholder="Александров">
                                    </div>
                                    <div class="input-field">
                                        <label>Отчество</label>
                                        <input id="patronymic" type="text" placeholder="Александрович">
                                    </div>
                                    <div class="input-field">
                                        <label>Пол</label>
                                        <select id="gender">
                                            <option disabled selected>Выберите пол</option>
                                            <option>М</option>
                                            <option>Ж</option>
                                        </select>
                                    </div>
                                    <div class="input-field">
                                        <label>Дата рождения</label>
                                        <input id="date_of_birth" type="date" min="1900-01-01" max="`+ now.getFullYear() +`-0`+ now.getMonth() +`-`+ now.getDate() +`">
                                    </div>
                                    <div class="input-field"></div>
                                </div><hr class="hr">
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Серия паспорта</label>
                                        <input id="passport_series" type="text" placeholder="4123">
                                    </div>
                                    <div class="input-field">
                                        <label>Номер паспорта</label>
                                        <input id="passport_number" type="text" placeholder="123456">
                                    </div>
                                    <div class="input-field">
                                        <label>Дата выдачи паспорта</label>
                                        <input id="date_of_issue" type="date" min="1900-01-01" max="`+ now.getFullYear() +`-0`+ now.getMonth() +`-`+ now.getDate() +`">
                                    </div>
                                </div><hr class="hr">
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер телефона</label>
                                        <input id="phone_number" type="text" placeholder="7(310)566-68-49">
                                    </div>
                                    <div class="input-field">
                                        <label>Email</label>
                                        <input id="email" type="email" placeholder="test@gmail.com">
                                    </div>
                                    <div class="input-field"></div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Данные адреса</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Страна</label>
                                        <input id="country" type="text" placeholder="США">
                                    </div>
                                    <div class="input-field">
                                        <label>Город</label>
                                        <input id="city" type="text" placeholder="North Carolina">
                                    </div>
                                    <div class="input-field">
                                        <label>Улица</label>
                                        <input id="street" type="text" placeholder="Powell Hills">
                                    </div>
                                    <div class="input-field">
                                        <label>Дом</label>
                                        <input id="house" type="text" placeholder="17">
                                    </div>
                                    <div class="input-field">
                                        <label>Квартира</label>
                                        <input id="flat" type="text" placeholder="57">
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
                                        <input id="login" type="text" placeholder="customer123">
                                    </div>
                                    <div class="input-field">
                                        <label>Пароль</label>
                                        <input id="password" type="password" placeholder="123abc123">
                                    </div>
                                    <div class="input-field"></div>
                                </div>
                                <button class="nextBtn">
                                    <span class="btnText">Изменить</span>
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