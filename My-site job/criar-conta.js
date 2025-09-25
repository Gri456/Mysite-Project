 // ====== util ======
  function uuidv4(){
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; // v4
    b[8] = (b[8] & 0x3f) | 0x80; // variant
    const x = [...b].map(n=>n.toString(16).padStart(2,'0'));
    return `${x.slice(0,4).join('')}-${x.slice(4,6).join('')}-${x.slice(6,8).join('')}-${x.slice(8,10).join('')}-${x.slice(10,16).join('')}`;
  }
  function setMsg(text, ok=false){
    const el = document.getElementById('msg');
    el.classList.remove('hidden','text-red-300','text-green-300');
    el.classList.add(ok?'text-green-300':'text-red-300');
    el.textContent = text;
  }
  async function postJSON(url, body){
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const ct = res.headers.get('content-type') || '';
    const raw = await res.text();
    if (!ct.includes('application/json')) {
      // Mostra os primeiros caracteres da resposta para diagnosticar
      throw new Error(`Resposta não‑JSON de ${url}: ${raw.slice(0,200)}`);
    }
    const data = JSON.parse(raw);
    if (!res.ok && !data.ok) {
      throw new Error(data.error || `Erro HTTP ${res.status}`);
    }
    return data;
  }

  // ====== UI: código + copiar ======
  let currentCode = uuidv4();
  const codeBox = document.getElementById('codeBox');
  codeBox.textContent = currentCode;

  document.getElementById('copyBtn').addEventListener('click', async ()=>{
    try {
      await navigator.clipboard.writeText(currentCode);
      setMsg('Código copiado para a área de transferência ✅', true);
    } catch {
      setMsg('Não foi possível copiar. Copia manualmente.');
    }
  });

  // ====== força da password ======
  const strengthBar = document.getElementById('strength');
  const strengthText = document.getElementById('strengthText');
  document.getElementById('password').addEventListener('input', (e)=>{
    const v = e.target.value;
    let score = 0;
    if(v.length >= 6) score++;
    if(/[A-Z]/.test(v)) score++;
    if(/[a-z]/.test(v)) score++;
    if(/[0-9]/.test(v)) score++;
    if(/[^A-Za-z0-9]/.test(v)) score++;
    const pct = Math.min(100, (score/5)*100);
    strengthBar.style.width = pct + '%';
    strengthBar.className = 'h-2';
    if(pct < 40){ strengthBar.classList.add('bg-red-400'); strengthText.textContent='Força: fraca'; }
    else if(pct < 70){ strengthBar.classList.add('bg-yellow-400'); strengthText.textContent='Força: média'; }
    else { strengthBar.classList.add('bg-green-400'); strengthText.textContent='Força: forte'; }
  });

  // ====== mostrar/ocultar password ======
  document.getElementById('togglePwd').addEventListener('click', ()=>{
    const ipt = document.getElementById('password');
    const b = document.getElementById('togglePwd');
    if(ipt.type === 'password'){ ipt.type='text'; b.textContent='Ocultar'; }
    else { ipt.type='password'; b.textContent='Mostrar'; }
  });

  // ====== submit: registar via API ======
  document.getElementById('signupForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const pwd = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    if(pwd !== confirm){ setMsg('As palavras‑passe não coincidem.'); return; }
    if(pwd.length < 6){ setMsg('A palavra‑passe deve ter pelo menos 6 caracteres.'); return; }

    try {
      const data = await postJSON('api/register.php', { uuid: currentCode, password: pwd });
      if (data.ok) {
        localStorage.setItem('bitjourney_id', currentCode);
        setMsg('Conta criada com sucesso! Guarda o teu código. Podes fazer login agora.', true);
      } else {
        // se a API devolver ok=false com erro
        setMsg('Erro: ' + (data.error || 'Falha ao criar conta.'));
      }
    } catch (err) {
      // Aqui apanhamos HTML/erros do PHP e mostramos no ecrã para depurar
      console.error(err);
      // Se o erro mencionar UUID existente, gera um novo código e atualiza a UI
      if (String(err.message).toLowerCase().includes('uuid')) {
        currentCode = uuidv4();
        codeBox.textContent = currentCode;
      }
    }
  });