# UPI PayDesk

### Generate. Share. Manage.

UPI PayDesk is a modern and responsive UPI payment QR generator and payment management tool designed for businesses, freelancers, shop owners, and individuals.

It allows users to generate dynamic UPI payment QR codes using business details, client information, UPI ID, amount, reference number, and payment notes. The application also keeps a local payment history and provides useful payment statistics for quick tracking.

## Features

- Generate UPI payment QR codes
- Business name and UPI ID management
- Client name support
- Enter custom payment amount
- Quick amount buttons
- Add payment reference
- Add payment note
- Download QR code as PNG
- Copy UPI payment link
- Print payment QR
- Payment history
- Client details in payment history
- Total QR count
- Total payment amount
- Today's QR count
- LocalStorage-based data storage
- Dark mode
- Form reset
- Input validation
- Toast notifications
- Responsive design
- Automatically saves business name and UPI ID
- Stores up to the latest 50 payment records

## Technologies Used

- HTML5
- CSS3
- JavaScript
- QRCode.js
- Boxicons
- LocalStorage API

## Project Structure

```text
upi-paydesk/
│
├── index.html
├── style.css
├── script.js
├── LICENSE
├── README.md
│
└── screenshots/
    ├── dark-mode.png
    ├── generated-qr.png
    ├── history.png
    └── light-mode.png
```

## How It Works

1. Enter the business name.
2. Enter the client name.
3. Enter the UPI ID.
4. Enter or select the payment amount.
5. Optionally add a reference number and payment note.
6. Click **Generate QR**.
7. Scan the generated QR code using a supported UPI application.
8. Download, copy, or print the generated payment QR.
9. View generated payment records in the history section.

## UPI Payment Format

The application generates a standard UPI payment URI using parameters such as:

- `pa` — UPI ID
- `pn` — Payee/business name
- `am` — Payment amount
- `cu` — Currency
- `tn` — Transaction note
- `tr` — Transaction reference

Example structure:

```text
upi://pay?pa=yourupi@bank&pn=Your%20Business&am=500.00&cu=INR
```

## Privacy

UPI PayDesk is a client-side application.

Payment history and saved business information are stored locally in the browser using LocalStorage. No payment information is sent to a personal server or database by the application.

Clearing browser storage or site data may remove locally stored history.

## Responsive Design

UPI PayDesk is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

## Getting Started

No server or installation is required.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/upi-paydesk.git
```

### 2. Open the project

Open the project folder in VS Code or another code editor.

### 3. Run the application

Open `index.html` in a web browser.

For development, you can also use the **Live Server** extension in VS Code.

## Preview Of My Project

### QR Generator

<p align="center">
  <img src="screenshots/generated-qr.png" width="48%">
  <img src="screenshots/light-mode.png" width="48%">
</p>

### Payment Management

<p align="center">
  <img src="screenshots/history.png" width="48%">
  <img src="screenshots/dark-mode.png" width="48%">
</p>

## Live Demo

🚀 [UPI PayDesk — Live Demo](https://hetmochi05.github.io/upi-paydesk/)

Try the live application directly in your browser.

## Future Improvements

The following features can be added in future versions:

- [ ] Payment status: Pending / Paid / Cancelled
- [ ] Search and filter payment history
- [ ] Edit and delete history records
- [ ] Customer management
- [ ] Business profile
- [ ] Business logo
- [ ] Phone number and address
- [ ] GSTIN support
- [ ] Multiple UPI IDs
- [ ] Invoice generator
- [ ] Receipt generator
- [ ] PDF export
- [ ] CSV/Excel export
- [ ] Date range filtering
- [ ] Daily, weekly, and monthly analytics
- [ ] Charts and dashboard
- [ ] Share QR code
- [ ] Custom QR size and design
- [ ] Cloud database
- [ ] User authentication
- [ ] Multi-device synchronization

## Project Goals

UPI PayDesk was created as a practical web development project to provide a simple interface for generating UPI payment QR codes and managing basic payment records.

The project also demonstrates practical usage of:

- DOM manipulation
- JavaScript event handling
- Form validation
- LocalStorage
- QR code generation
- Dynamic UI updates
- Responsive CSS
- Dark mode
- Browser APIs

## Learning Outcomes

This project helped demonstrate practical knowledge of:

- HTML structure and forms
- CSS responsive layouts
- JavaScript modules and functions
- Client-side data storage
- QR code generation
- Dynamic table rendering
- Input validation
- User interface design
- Browser APIs
- Front-end project organization

## Disclaimer

UPI PayDesk is an independent utility project created for generating UPI payment QR codes.

It is not affiliated with NPCI, Google Pay, PhonePe, Paytm, or any bank/payment service provider.

The application does not process, authorize, or verify financial transactions. Users should verify payment details before making or accepting a payment.

## Author

**Het Mochi**

MCA Student | Web Developer

- GitHub: Add your GitHub profile link
- LinkedIn: Add your LinkedIn profile link

## Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

For suggestions, improvements, or issues, create an issue in the repository.

## License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.
