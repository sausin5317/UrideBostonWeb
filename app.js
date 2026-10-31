/**
 * Uride Boston — Coming Soon & Driver Pre-Registration
 */

document.addEventListener('DOMContentLoaded', function () {
    // Target URL for QR Code & redirection (MUST include https:// so smartphone cameras trigger direct website link prompt)
    var targetUrl = 'https://www.urideadu.com';

    var qrCanvas = document.getElementById('qrCanvas');
    var qrUrlLabel = document.getElementById('qrUrlLabel');
    var downloadQrBtn = document.getElementById('downloadQrBtn');
    var copyLinkBtn = document.getElementById('copyLinkBtn');

    if (qrUrlLabel) {
        qrUrlLabel.textContent = targetUrl;
    }

    // Render Scannable QR Code
    if (qrCanvas && window.QRCodeGenerator) {
        window.QRCodeGenerator.renderToCanvas(qrCanvas, targetUrl, {
            size: 240,
            foreground: '#000000', // Pure high-contrast black for instant phone camera detection
            background: '#FFFFFF',
            correctLevel: 1 // Level M
        });
    }

    // Download QR Code as PNG
    if (downloadQrBtn && qrCanvas) {
        downloadQrBtn.addEventListener('click', function () {
            var link = document.createElement('a');
            link.download = 'uride-adu-qr.png';
            link.href = qrCanvas.toDataURL('image/png');
            link.click();
        });
    }

    // Copy Link
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function () {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(targetUrl).then(function () {
                    copyLinkBtn.textContent = 'Link Copied!';
                    setTimeout(function () { copyLinkBtn.textContent = 'Copy Page Link'; }, 2000);
                });
            } else {
                var temp = document.createElement('input');
                temp.value = targetUrl;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
                copyLinkBtn.textContent = 'Link Copied!';
                setTimeout(function () { copyLinkBtn.textContent = 'Copy Page Link'; }, 2000);
            }
        });
    }

    // Social Sharing Links
    var shareMsg = "Join Uride in Boston! A new rideshare app built for drivers with honest fares and 100% earnings transferred after each ride. Register for the pilot here: " + targetUrl;
    var encodedShareMsg = encodeURIComponent(shareMsg);
    var encodedUrl = encodeURIComponent(targetUrl);

    var shareWhatsApp = document.getElementById('shareWhatsApp');
    if (shareWhatsApp) {
        shareWhatsApp.href = "https://api.whatsapp.com/send?text=" + encodedShareMsg;
    }

    var shareFacebook = document.getElementById('shareFacebook');
    if (shareFacebook) {
        shareFacebook.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl;
    }

    var shareTwitter = document.getElementById('shareTwitter');
    if (shareTwitter) {
        shareTwitter.href = "https://twitter.com/intent/tweet?url=" + encodedUrl + "&text=" + encodeURIComponent("Uride is coming to Boston! Built for drivers with honest fares & 100% earnings transferred. Register:");
    }

    var shareInstagram = document.getElementById('shareInstagram');
    if (shareInstagram) {
        shareInstagram.addEventListener('click', function () {
            if (navigator.share) {
                navigator.share({
                    title: 'Uride Boston — Built for the Driver',
                    text: shareMsg,
                    url: targetUrl
                }).catch(function () {});
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareMsg).then(function () {
                    var span = shareInstagram.querySelector('span');
                    if (span) span.textContent = 'Link Copied!';
                    setTimeout(function () { if (span) span.textContent = 'Instagram'; }, 2200);
                });
            }
        });
    }
    var driverForm = document.getElementById('driverForm');
    var successBox = document.getElementById('successBox');
    var successMessage = document.getElementById('successMessage');
    var registerAnotherBtn = document.getElementById('registerAnotherBtn');

    if (driverForm) {
        driverForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var fullName = document.getElementById('fullName').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var email = document.getElementById('email').value.trim();
            var area = document.getElementById('area').value.trim();
            var vehicle = document.getElementById('vehicle').value.trim();
            var vehicleYear = document.getElementById('vehicleYear').value.trim();

            // Clear errors
            document.getElementById('nameError').textContent = '';
            document.getElementById('phoneError').textContent = '';
            document.getElementById('emailError').textContent = '';
            document.getElementById('areaError').textContent = '';
            document.getElementById('vehicleError').textContent = '';
            document.getElementById('yearError').textContent = '';

            var hasError = false;

            if (!fullName) {
                document.getElementById('nameError').textContent = 'Please enter your name.';
                hasError = true;
            }
            if (!phone) {
                document.getElementById('phoneError').textContent = 'Please enter your phone number.';
                hasError = true;
            }
            if (!email || !email.includes('@')) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address.';
                hasError = true;
            }
            if (!area) {
                document.getElementById('areaError').textContent = 'Please enter your neighborhood or area.';
                hasError = true;
            }
            if (!vehicle) {
                document.getElementById('vehicleError').textContent = 'Please enter vehicle make and model.';
                hasError = true;
            }
            if (!vehicleYear) {
                document.getElementById('yearError').textContent = 'Please enter vehicle year.';
                hasError = true;
            }

            if (hasError) return;

            var submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Submitting...</span>';
            }

            var record = {
                "Full Name": fullName,
                "Phone Number": phone,
                "Email Address": email,
                "Boston Area": area,
                "Vehicle": vehicleYear + ' ' + vehicle,
                "Driving Background": document.getElementById('experience').value,
                "Notes / Availability": document.getElementById('comments').value.trim() || 'None',
                "Submitted At": new Date().toLocaleString()
            };

            // 1. Local backup in browser
            var submissions = [];
            try {
                submissions = JSON.parse(localStorage.getItem('uride_driver_registrations') || '[]');
            } catch (err) {
                submissions = [];
            }
            submissions.push(record);
            localStorage.setItem('uride_driver_registrations', JSON.stringify(submissions));

            // 2. Direct email delivery to brandaovicente4@gmail.com
            var payload = {
                name: fullName,
                phone: phone,
                email: email,
                area: area,
                vehicle: vehicleYear + ' ' + vehicle,
                background: document.getElementById('experience').value,
                notes: document.getElementById('comments').value.trim() || 'N/A',
                _subject: "New Uride Boston Driver Registration: " + fullName,
                _template: "table",
                _captcha: "false"
            };

            // Optional Google Apps Script Webhook URL (if configured)
            var googleSheetWebhookUrl = localStorage.getItem('uride_google_sheet_webhook') || '';

            // Send to brandaovicente4@gmail.com
            fetch('https://formsubmit.co/ajax/brandaovicente4@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            }).catch(function (err) {
                console.log('Form submission network notification:', err);
            });

            // If Google Sheet Webhook is configured, also post to Google Sheet
            if (googleSheetWebhookUrl) {
                fetch(googleSheetWebhookUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(record)
                }).catch(function (e) { console.log('Google sheet post:', e); });
            }

            // Show success message
            driverForm.style.display = 'none';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Register for Boston Pilot</span>';
            }
            if (successBox) {
                successBox.style.display = 'block';
                if (successMessage) {
                    successMessage.textContent = 'Thank you, ' + fullName + '! Your registration for the Uride Boston pilot has been sent to our team. We will be in touch at ' + email + ' / ' + phone + ' with onboarding details.';
                }
            }
        });
    }

    if (registerAnotherBtn) {
        registerAnotherBtn.addEventListener('click', function () {
            if (driverForm) {
                driverForm.reset();
                driverForm.style.display = 'block';
            }
            if (successBox) {
                successBox.style.display = 'none';
            }
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
