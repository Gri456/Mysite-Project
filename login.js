document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('togglePwdBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const pwdInput = document.getElementById('pwd');
            if (pwdInput) {
                pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
            }
        });
    }

    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const uuid = document.getElementById('uuid').value.trim();
        const pwd  = document.getElementById('pwd').value;

        try {
            const res = await fetch('/api/login.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ uuid, password: pwd })
            });
            const data = await res.json();
            if (data.ok) {
                alert(`Login OK! Premium: ${data.premium}`);
            } else {
                document.getElementById('msg').textContent = data.error || 'Erro desconhecido';
            }
        } catch (err) {
            console.error(err);
            document.getElementById('msg').textContent = 'Falha na requisição';
        }
    });
});