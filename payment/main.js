const API_BASE = 'http://127.0.0.1:3000';

function checkUserRegistration() {
	const userSession = localStorage.getItem('userSession');
	if (!userSession) {
		window.location.href = '/register/index.html';
	}
}

async function startPayment() {
	const payBtn = document.getElementById('pay-now');
	if (!payBtn) return;

	if (typeof Razorpay === 'undefined') {
		alert('Payment script not loaded. Please retry.');
		return;
	}

	payBtn.disabled = true;
	payBtn.textContent = 'Processing...';

	try {
		const res = await fetch(`${API_BASE}/api/create-order`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				amount: 49900, // paise
				currency: 'INR',
				email: localStorage.getItem('userEmail') || ''
			})
		});
		if (!res.ok) throw new Error('Failed to create order');
		const order = await res.json();

		const options = {
			key: order.keyId,
			amount: order.amount,
			currency: order.currency,
			name: 'Aegus',
			description: 'Account activation',
			order_id: order.orderId,
			prefill: {
				email: localStorage.getItem('userEmail') || order.email || ''
			},
			theme: { color: '#1a4cff' },
			handler: async function (response) {
				try {
					const verifyRes = await fetch(`${API_BASE}/api/verify-payment`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							orderId: order.orderId,
							paymentId: response.razorpay_payment_id,
							signature: response.razorpay_signature
						})
					});

					if (!verifyRes.ok) throw new Error('Verification failed');
					const verifyJson = await verifyRes.json();
					if (verifyJson.status !== 'ok') throw new Error('Signature invalid');

					localStorage.setItem('paymentStatus', 'completed');
					localStorage.setItem('paymentDate', new Date().toISOString());
					localStorage.setItem('transactionId', response.razorpay_payment_id);

					window.location.href = '/dashboard/index.html';
				} catch (err) {
					console.error('Verification error:', err);
					alert('Payment verification failed. Please contact support.');
					payBtn.disabled = false;
					payBtn.textContent = 'Pay Now';
				}
			},
			modal: {
				ondismiss: function () {
					payBtn.disabled = false;
					payBtn.textContent = 'Pay Now';
				}
			}
		};

		const rzp = new Razorpay(options);
		rzp.open();
	} catch (err) {
		console.error(err);
		alert('Unable to start payment. Please try again.');
		payBtn.disabled = false;
		payBtn.textContent = 'Pay Now';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	checkUserRegistration();
	const payBtn = document.getElementById('pay-now');
	if (payBtn) {
		payBtn.addEventListener('click', (e) => {
			e.preventDefault();
			startPayment();
		});
	}
});
