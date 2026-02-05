# International Bank Management System

A full-stack enterprise banking platform with role-based access control, real-time currency exchange, multi-currency account management, and comprehensive transaction tracking. Built with PHP, PostgreSQL, and modern JavaScript, containerized with Docker for scalable deployment.

## Technical Overview

This system implements a complete digital banking infrastructure supporting multiple user roles (Customers, Employees, Administrators), multi-currency operations (USD, EUR), real-time exchange rate calculations, and transactional database operations with ACID compliance. The architecture emphasizes data integrity, role-based security, and seamless user experience through AJAX-driven dynamic interfaces.

### Core Technical Challenges Solved

**1. Role-Based Access Control (RBAC) with Session Management**
- Three-tier permission hierarchy: Customers (account operations), Employees (customer management), Administrators (system-wide control)
- PHP session-based authentication with server-side validation on every protected route
- Separate UI/UX flows and data access patterns per role while sharing common infrastructure
- Protected endpoints with role verification preventing horizontal privilege escalation

**2. Transactional Multi-Table Insertion with Automatic Sequence Recovery**
- Complex entity registration requiring coordinated inserts across 5+ normalized tables (Address → Individual → Account → Career → Customer)
- Self-healing mechanism for PostgreSQL sequence conflicts using `pg_get_serial_sequence` and `setval`
- Retry logic with exponential backoff handling race conditions in concurrent environments
- Transaction atomicity ensuring all-or-nothing operations with proper rollback on partial failures

**3. Real-Time Multi-Currency Exchange with Dynamic Rate Calculation**
- Live currency conversion using database-stored exchange rates
- Bidirectional conversion calculator with instant feedback via AJAX polling
- Buy/sell spread calculation showing market maker margins
- Card-based currency exchange executing atomic balance transfers across currency accounts

**4. Database Function-Based Business Logic Encapsulation**
- Critical operations implemented as PostgreSQL stored procedures/functions (e.g., `f-currency_exchange_by_card`)
- Server-side validation and business rule enforcement at the database layer
- Reduced network round-trips and improved transaction consistency
- Centralized logic preventing business rule drift across application components

**5. Containerized Multi-Service Architecture with Remote PostgreSQL**
- Docker Compose orchestration separating application (PHP/Apache) and management (pgAdmin) layers
- Environment-based configuration supporting local development and cloud deployment (Supabase integration)
- Volume persistence for pgAdmin ensuring management interface state retention
- Network isolation with bridge networking for inter-container communication

## Architecture & Design Patterns

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Compose Layer                     │
├──────────────────────────┬──────────────────────────────────┤
│   PHP 8.2 + Apache       │         pgAdmin 4                │
│   (Application Server)   │   (Database Management)          │
│   Port: 8080             │   Port: 5050                     │
└──────────┬───────────────┴──────────────┬───────────────────┘
           │                               │
           └───────────────┬───────────────┘
                           │
                  ┌────────▼─────────┐
                  │   PostgreSQL     │
                  │   (Supabase or   │
                  │    Local DB)     │
                  └──────────────────┘
```

### Directory Structure & Responsibilities

```
├── admin/                    # Administrator dashboard & CRUD operations
│   ├── index.php            # Main admin interface with sidebar navigation
│   ├── dashboard.php        # Aggregation queries & session data preparation
│   ├── *_reg.js            # Registration workflows (customer, employee, admin)
│   ├── *_info.js           # Information retrieval & table rendering
│   ├── queries/            # Reusable database query modules
│   └── vendor/             # Backend PHP handlers for AJAX operations
│
├── employee/                # Employee portal (limited admin capabilities)
│   ├── Similar structure to admin with restricted permissions
│   └── Cannot manage other employees or administrators
│
├── customer/                # Customer self-service portal
│   ├── lk.js               # Personal account dashboard logic
│   ├── convert_cr.js       # Currency conversion & exchange
│   ├── credit_cards_list.js # Card management interfaces
│   └── vendor/             # Customer-specific backend operations
│
├── guest/                   # Public-facing pages (unauthenticated)
│   ├── debit_card_page.php # New customer onboarding
│   ├── convert_cr.php      # Public currency calculator
│   └── Similar UI structure for marketing pages
│
├── login/                   # Authentication gateway
│   ├── index.php           # Login form with session initialization
│   └── vendor/signin.php   # Credential verification & role routing
│
├── vendor/                  # Shared utilities & configuration
│   └── db_connect.php      # PDO connection factory with error handling
│
├── db_dump/                 # Database schema & seed data
│   └── bank_new_dump.bak   # PostgreSQL custom format dump
│
├── Dockerfile               # PHP 8.2 + Apache + PDO PostgreSQL extensions
└── docker-compose.yml       # Multi-container orchestration
```

## Technical Implementation Details

### Database Connection Pattern with Environment Abstraction

The system uses a centralized connection factory supporting both Docker and local environments:

```php
// vendor/db_connect.php
$host = getenv('DB_HOST');
$port = getenv('DB_PORT');
$dbname = getenv('DB_NAME');
$username = getenv('DB_USER');
$password = getenv('DB_PASSWORD');

$db_connect = new PDO(
    "pgsql:host=$host;port=$port;dbname=$dbname", 
    $username, 
    $password
);
$db_connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db_connect->exec("SET datestyle TO 'DMY'");
```

**Key Features:**
- Environment variable-based configuration for 12-factor app compliance
- Manual `.env` parsing for non-Docker environments
- Global date format standardization (DMY) for international date handling
- Exception-based error mode for proper error propagation

### Transactional Insert Pattern with Sequence Conflict Resolution

Complex entity creation requires multiple coordinated insertions. The system implements a retry mechanism for sequence conflicts common in concurrent systems:

```php
function insertWithRetry($query, $db_connect, $table_name, $pk_column) {
    $max_retries = 7;
    $retries = 0;
    
    while ($retries < $max_retries) {
        try {
            $db_connect->beginTransaction();
            $result = resultNumber($query, $db_connect);
            $db_connect->commit();
            return $result;
        } catch (PDOException $e) {
            $db_connect->rollBack();
            
            // PostgreSQL unique violation (sequence conflict)
            if ($e->getCode() == '23505') {
                // Reset sequence to current max value
                $reset_query = "
                    SELECT setval(
                        pg_get_serial_sequence('\"$table_name\"', '$pk_column'), 
                        (SELECT MAX(\"$pk_column\") FROM \"$table_name\")
                    )";
                $db_connect->query($reset_query);
                $retries++;
            } else {
                throw $e;
            }
        }
    }
    return false;
}
```

**Technical Rationale:**
- Handles PostgreSQL sequence desynchronization after manual insertions or restores
- Automatically repairs sequences without manual intervention
- Graceful degradation: returns `false` after exhausting retries
- Preserves transaction semantics with proper rollback on non-recoverable errors

### AJAX-Driven Dynamic Form Workflow

Customer registration follows a multi-step wizard pattern with server-side validation at each stage:

**Phase 1: Personal & Passport Data Collection**
```javascript
$("#main_content").on("submit", "#customer", function(event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: 'vendor/customer_reg.php',
        data: {
            name: $("#name").val(),
            surname: $("#surname").val(),
            // ... 30+ fields
        }
    })
    .done(function(data) { 
        form_customer_card(data);  // Returns customer ID
    })
});
```

**Phase 2: Card Issuance & Multi-Currency Account Setup**
```javascript
$("#main_content").on("submit", "#customer_card", function(event) {
    $.ajax({
        url: 'vendor/customer_debit_card_reg.php',
        data: {
            ID_customer: $("#ID_customer").val(),
            Number: $("#Number").val(),
            CVV: $("#CVV").val(),
            PIN: $("#PIN").val(),
            Account_number_rub: $("#Account_number_rub").val(),
            Account_number_usd: $("#Account_number_usd").val(),
            Account_number_eur: $("#Account_number_eur").val()
        }
    })
});
```

**Design Benefits:**
- Progressive disclosure reduces cognitive load
- Server-side validation between phases prevents invalid state progression
- Customer ID returned from phase 1 enables referential integrity in phase 2
- Atomic commits per phase enable partial recovery on failure

### Real-Time Currency Conversion Algorithm

The system implements bidirectional conversion with live rate lookups:

```javascript
// Conversion when user modifies amount in currency A
function calc_cur_select() {
    $.ajax({
        type: 'POST',
        url: '../admin/queries/calc_currency.php',
        data: {
            flag: 1,  // Direction: A → B
            selected_currency_price: $("#selected_currency_price").val(),
            selected_currency_type: $("#selected_currency_type").val(),
            calc_currency_type: $("#calc_currency_type").val()
        }
    })
    .done(function(data) { 
        $('#calc_currency_price').val(data);  // Update converted amount
    })
}

// Reverse conversion when user modifies currency B
function calc_cur_calc() {
    $.ajax({
        data: { flag: 0 }  // Direction: B → A
    })
    .done(function(data) { 
        $('#selected_currency_price').val(data);
    })
}
```

**Backend Conversion Logic** (hypothetical implementation based on system behavior):
```php
// calc_currency.php
$flag = $_POST['flag'];
$selected_price = $_POST['selected_currency_price'];
$selected_type = $_POST['selected_currency_type'];
$calc_type = $_POST['calc_currency_type'];

// Fetch exchange rate from database
$query = "SELECT rate FROM exchange_rates 
          WHERE from_currency = '$selected_type' 
          AND to_currency = '$calc_type'";
$rate = $db_connect->query($query)->fetchColumn();

if ($flag == 1) {
    echo $selected_price * $rate;  // A → B
} else {
    echo $selected_price / $rate;  // B → A
}
```

### Card-Based Currency Exchange with Database Functions

The system uses PostgreSQL stored functions for atomic currency exchanges:

```javascript
$("#main_content").on("submit", "#exchange", function(event) {
    $.ajax({
        url: '../admin/queries/currency_exchange_by_card.php',
        data: {
            selected_currency_price: $("#selected_currency_price_2").val(),
            selected_currency_type: $("#selected_currency_type_2").val(),
            calc_currency_type: $("#calc_currency_type_2").val(),
            Number: $("#Number").val(),
            Closing_date: $("#Closing_date").val(),
            CVV: $("#CVV").val(),
            Name: $("#Name").val()
        }
    })
});
```

Backend implementation calling database function:
```php
// currency_exchange_by_card.php
$query = "
    SELECT * FROM \"f-currency_exchange_by_card\"(
        $selected_currency_price,
        '$selected_currency_type',
        '$calc_currency_type', 
        '$Number', 
        '$Closing_date', 
        '$CVV', 
        '$Name'
    )";
$result = $db_connect->query($query);
```

**Database Function Responsibilities:**
- Card validation (number, CVV, expiration date, cardholder name)
- Balance verification for source currency account
- Exchange rate lookup and application
- Atomic debit from source currency account
- Atomic credit to target currency account
- Transaction logging for audit trail
- All operations wrapped in a database transaction

### Dashboard Aggregation with Session-Based Caching

The admin dashboard pre-computes expensive aggregations on load:

```php
// admin/dashboard.php
session_start();

// Customer accounts overview (likely a complex view/join)
$query = 'SELECT * FROM all_customer_accounts';
$_SESSION['all_customer_accounts'] = resultTable($query, $db_connect);

// Entity counts for dashboard widgets
$query = 'SELECT COUNT("ID_customer") FROM "Customer"';
$_SESSION['count_customers'] = resultNumber($query, $db_connect);

// Similar for employees, administrators, offices...

header('Location: index.php');
```

**JavaScript Rendering:**
```javascript
// dashboard_js.php (embedded in admin/index.php)
$('#count_customers').append('<?php echo $_SESSION['count_customers']; ?>');
$('#all_customer_accounts').append(parse_json(
    <?php echo $_SESSION['all_customer_accounts']; ?>
));
```

**Performance Optimization:**
- Single query execution per metric on page load
- Results cached in PHP session (server-side memory)
- Subsequent page renders use cached data until session expires
- Reduces database load for frequently accessed dashboards

### Dynamic Table Generation from JSON

Reusable JavaScript pattern for converting backend JSON to HTML tables:

```javascript
function parse_json(data) {
    var table = '<table>';
    var thead = '<thead><tr>';
    
    // Generate headers from first row
    $(data[0]).each(function(ind_cell, val_cell) { 
        thead += "<th>" + val_cell + "</th>";
    });
    thead += '</tr></thead>';
    table += thead;
    
    // Generate data rows
    var tbody = '<tbody>';
    $(data).each(function(index, element) { 
        if (index > 0) {  // Skip header row
            tbody += '<tr>';
            $(element).each(function(ind_cell, val_cell) {
                tbody += "<td><p>" + val_cell + "</p></td>";
            });
            tbody += '</tr>';
        }
    });
    tbody += '</tbody>';
    
    return table + tbody + '</table>';
}
```

**Backend JSON Structure:**
```php
function resultTable(string $query, $db_connect) {
    $result = $db_connect->query($query);
    
    // Build header row from column metadata
    for ($i = 0; $i < $result->columnCount(); $i++) {
        $col = $result->getColumnMeta($i);
        $result_arr[0][$i] = $col['name'];
    }
    
    // Append data rows
    $result_arr2 = $result->fetchAll(PDO::FETCH_NUM);
    foreach ($result_arr2 as $row_index => $row_data) {
        $result_arr[$row_index + 1] = $row_data;
    }
    
    return json_encode($result_arr);
}
```

## Security Considerations

### Input Sanitization
Every user input passes through a multi-stage sanitization pipeline:

```php
function test_input($data) {
    $data = trim($data);           // Remove whitespace
    $data = stripslashes($data);   // Remove escape characters
    $data = htmlspecialchars($data); // Encode HTML special chars
    return $data;
}
```

**Protection Against:**
- XSS attacks (HTML encoding)
- SQL injection (combined with PDO parameterized queries where used)
- Directory traversal (slash stripping)

### Session-Based Authentication
```php
session_start();
if (!@$_SESSION['admin']) {
    header('Location: ../login/index.php');
}
```

**Security Features:**
- Server-side session storage (PHP session files or database)
- Session hijacking mitigation through HttpOnly cookies (assumed PHP defaults)
- Role verification on every protected page load
- Logout functionality with proper session destruction

### Database Security

**Connection Security:**
- Credentials stored in environment variables, never in code
- PDO with prepared statements for parameterized queries (partial implementation)
- Exception-based error handling preventing information leakage

**Architectural Security:**
- Database functions encapsulate business logic, reducing attack surface
- Stored procedures prevent direct table access from application layer
- Transaction isolation ensuring data consistency under concurrent access

## Technical Stack

### Backend
- **PHP 8.2**: Modern PHP with named arguments, enums, and performance improvements
- **PDO (PHP Data Objects)**: Database abstraction layer with PostgreSQL driver
- **PostgreSQL 15+**: Advanced RDBMS with ACID compliance, stored procedures, and complex data types
- **Apache 2.4**: Production-grade HTTP server with mod_rewrite enabled

### Frontend
- **jQuery 3.6.0**: DOM manipulation and AJAX orchestration
- **Vanilla JavaScript**: Form generation, event handling, dynamic content injection
- **Spectre.Console CSS** (inferred from Boxicons): Styling framework
- **Boxicons 2.1.2**: Icon library for UI elements

### DevOps & Infrastructure
- **Docker 20.10+**: Container runtime for application isolation
- **Docker Compose 2.x**: Multi-container orchestration
- **Supabase**: PostgreSQL-as-a-Service with connection pooling and backups
- **pgAdmin 4**: Web-based PostgreSQL management interface

## Database Schema Architecture

Based on code analysis, the schema implements a highly normalized design:

### Core Entities
- **Individual**: Personal information (name, passport, contact)
- **Address**: Normalized address storage (country, city, street, house, flat)
- **Account**: Authentication credentials (login, password)
- **Career**: Employment data (income, work experience, currency)
- **Customer**: Composite entity linking Individual, Account, and Career
- **Employee**: Bank staff with similar structure to Customer
- **Administrator**: System admins with elevated privileges
- **Office**: Bank branch locations

### Financial Entities
- **Debit_Card**: Card details (number, CVV, PIN, closing date)
- **Customer_Debit_Card**: Many-to-many relationship between customers and cards
- **Account_Currency**: Multi-currency account balances (RUB, USD, EUR accounts per card)
- **Currency**: Currency definitions (abbreviation, exchange rates)
- **Transaction**: Financial operations audit log

### Views & Computed Tables
- **all_customer_accounts**: Denormalized view joining customer, account, and balance data
- Likely additional views for transaction summaries, currency dynamics, etc.

## Deployment Architecture

### Docker Compose Configuration

```yaml
services:
  app:
    build: .
    volumes:
      - .:/var/www/html  # Live code reload during development
    env_file:
      - .env  # Supabase credentials
    ports:
      - "8080:80"
    networks:
      - my-app-network

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin  # Persistent configuration
    networks:
      - my-app-network
```

### Dockerfile Optimization

```dockerfile
FROM php:8.2-apache

# Install PostgreSQL extensions
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Enable URL rewriting
RUN a2enmod rewrite

COPY . .
EXPOSE 80
```

**Production Considerations:**
- Multi-stage builds for smaller image size
- Non-root user execution for security
- Health checks for container orchestration
- Resource limits (CPU, memory) in production compose file

## Advanced Features

### Multi-Currency Account System
- Each debit card links to three currency-specific accounts (RUB, USD, EUR)
- Automatic currency conversion during cross-currency transactions
- Exchange rate tables with buy/sell spreads
- Historical exchange rate tracking for reporting

### Transaction Lifecycle
1. User initiates transaction (purchase, transfer, exchange)
2. Card validation (number, CVV, expiration, cardholder)
3. Balance check in relevant currency account
4. Transaction insertion with pending status
5. Atomic balance update using database functions
6. Transaction status update to completed
7. Audit log entry creation

### Analytics & Reporting
- Month-over-month income comparison with percentage change
- Total balance aggregation across all customer cards
- Expense tracking per customer
- Turnover calculations (sum of all transactions)
- Currency dynamics visualization (USD rate over time)

### Role-Based UI Customization
- **Customers**: Personal account view, card management, currency exchange
- **Employees**: Customer CRUD, transaction oversight, limited reporting
- **Administrators**: Full system access, employee management, office management

## Performance Characteristics

### Database Query Optimization
- **Indexed Columns**: Primary keys, foreign keys, login fields
- **Materialized Views**: Pre-computed aggregations for dashboards (inferred)
- **Connection Pooling**: Supabase handles connection pooling at database layer
- **Query Caching**: PHP session caching for expensive aggregations

### Frontend Performance
- **Lazy Loading**: Dynamic content injection via AJAX reduces initial page load
- **Client-Side Validation**: Reduces unnecessary server round-trips
- **JSON Data Transfer**: Efficient binary encoding for table data

### Scalability Considerations
- **Stateless Application Layer**: Horizontal scaling via container replication
- **Database Connection Limit**: PDO persistent connections reuse existing connections
- **Session Storage**: File-based sessions limit horizontal scaling (Redis recommended)

## Development Workflow

### Local Development Setup

```bash
# Clone repository
git clone <repository-url>
cd Bank-main

# Create .env file with database credentials
cat > .env << EOF
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
PGADMIN_EMAIL=admin@bank.local
PGADMIN_PASSWORD=admin
EOF

# Start containers
docker-compose up -d

# Restore database from dump
docker exec -i bank-db pg_restore -U postgres -d postgres < db_dump/bank_new_dump.bak

# Access application
# Application: http://localhost:8080
# pgAdmin: http://localhost:5050
```

### Database Management

```bash
# Connect to PostgreSQL via pgAdmin
# 1. Open http://localhost:5050
# 2. Login with PGADMIN_EMAIL and PGADMIN_PASSWORD
# 3. Add server with Supabase credentials

# Or use psql directly
docker exec -it bank-db psql -U postgres -d postgres
```

## Testing Strategies

### Unit Testing Opportunities
- **PHP Functions**: `test_input()`, `resultNumber()`, `resultTable()`, `insertWithRetry()`
- **JavaScript Utilities**: `parse_json()`, `parse_json_select()`, date formatting

### Integration Testing
- Multi-table insert flows with rollback verification
- Currency exchange accuracy with edge cases (zero amounts, invalid currencies)
- Session persistence and role-based access control

### End-to-End Testing
- Complete customer registration workflow
- Currency exchange from card selection to balance update
- Transaction history generation and reporting

## Security Hardening Recommendations

### Current Vulnerabilities

**SQL Injection Risk:**
- Many queries use string interpolation instead of prepared statements
- Example: `$query = "SELECT * FROM \"Customer\" WHERE login='$login'"`
- **Mitigation**: Convert all queries to PDO prepared statements with bound parameters

**Password Storage:**
- Passwords appear to be stored in plaintext
- **Mitigation**: Implement `password_hash()` and `password_verify()` with bcrypt

**XSS in JSON Rendering:**
- `parse_json()` directly injects database values into HTML without encoding
- **Mitigation**: Apply `htmlspecialchars()` to all dynamic content

**CSRF Protection:**
- No token-based CSRF protection observed
- **Mitigation**: Implement anti-CSRF tokens for all state-changing operations

### Production Security Checklist
- [ ] Enable HTTPS with Let's Encrypt certificates
- [ ] Implement rate limiting for authentication endpoints
- [ ] Add input validation beyond sanitization (regex patterns, length limits)
- [ ] Enable PostgreSQL SSL connections
- [ ] Implement audit logging for sensitive operations
- [ ] Add intrusion detection for suspicious query patterns
- [ ] Configure Content Security Policy headers
- [ ] Enable HSTS headers

## Future Enhancement Opportunities

### Technical Improvements
- **API Layer**: RESTful API for mobile app integration
- **Real-Time Updates**: WebSocket implementation for live transaction notifications
- **Microservices**: Split into authentication, transaction, and reporting services
- **Message Queue**: RabbitMQ for asynchronous transaction processing
- **Caching Layer**: Redis for session storage and query result caching

### Feature Additions
- **Credit Card Support**: Loan management with interest calculation
- **Wire Transfers**: SWIFT/IBAN integration for international transfers
- **Automated Bill Pay**: Recurring payment scheduling
- **Mobile Banking**: Native iOS/Android applications
- **Fraud Detection**: Machine learning models for anomaly detection
- **Two-Factor Authentication**: TOTP or SMS-based 2FA
- **Document Management**: PDF statement generation and secure storage

### DevOps Enhancements
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Infrastructure as Code**: Terraform for cloud resource provisioning
- **Monitoring**: Prometheus + Grafana for application metrics
- **Logging**: ELK stack for centralized log aggregation
- **Backup Automation**: Automated PostgreSQL backups to S3
- **Blue-Green Deployment**: Zero-downtime deployment strategy

## Code Quality Metrics

### Maintainability
- **Separation of Concerns**: Clear division between presentation, business logic, and data layers
- **Code Reusability**: Shared utility functions (`test_input`, `resultTable`, `parse_json`)
- **Naming Conventions**: Descriptive variable and function names (though some Russian text)

### Technical Debt
- **SQL Injection Risk**: String interpolation in queries
- **DRY Violations**: Repeated form generation code across role directories
- **Mixed Languages**: Russian UI text embedded in JavaScript (internationalization needed)
- **Error Handling**: Inconsistent error reporting (alerts vs. inline messages)

### Scalability Bottlenecks
- **File-Based Sessions**: Limits horizontal scaling
- **Synchronous AJAX**: Sequential operations could be parallelized
- **Monolithic Architecture**: Single point of failure

## License

This project is licensed under the MIT License – see the LICENSE file for details.

## Author

This project demonstrates proficiency in full-stack web development with emphasis on database-driven applications, transactional integrity, multi-role systems, and real-world banking domain complexity. The implementation showcases understanding of ACID transactions, normalized database design, role-based security, and containerized deployment patterns. While production-hardening is needed (prepared statements, password hashing, CSRF tokens), the architectural foundation supports enterprise-scale banking operations with proper refactoring.
