async function oauthLogin(provider) {
    try {
        // 1. Simular a obtenção de um token do SDK do provedor (Google, Apple, GitHub)
        // Num cenário real, isto abriria um popup ou redirecionaria para a página de login do provedor
        const dummyToken = `mock_${provider}_token_${Math.random().toString(36).substring(7)}`;

        // 2. Enviar o token para o nosso backend
        const response = await fetch(`/api/auth/${provider}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: dummyToken })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.ok) {
                // Guardar o token JWT no localStorage
                localStorage.setItem("authToken", data.access_token);
                localStorage.setItem("isPremium", data.premium);

                // Redirecionar para a página principal
                window.location.href = 'index.html?login=1';
            } else {
                alert("Erro no login: " + data.error);
            }
        } else {
            alert("Erro na comunicação com o servidor.");
        }
    } catch (error) {
        console.error("Erro durante o login OAuth:", error);
        alert("Ocorreu um erro no processo de login.");
    }
}
