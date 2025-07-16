# SkillPass

**Passaporte de habilidades com staking de reputação para credibilidade**

---

## 💡 Inspiração

Gitcoin Passport prova que você é um humano confiável. Mas e se fôssemos além, criando um sistema onde suas habilidades são validadas on-chain e outros usuários podem apostar reputação em você? Imagine um “LinkedIn com skin in the game”.

---

## 🚩 Problema Real

- Em ambientes Web3 ou freelas, é difícil saber se alguém é confiável.
- “Provar” conhecimento depende de prints ou links de portfólio.
- Recomendação/referência é centralizada e não comprovável.
- Freelancers sofrem com desconfiança em plataformas como Fiverr e Upwork.

---

## ✅ Solução: SkillPass

Sistema de credenciais e endorsements com staking de reputação por terceiros.

### Como funciona

1. Usuário entra com Civic Embedded Wallet e cria seu perfil.
2. Adiciona skills (ex: React, Solana dev, designer, tradutor, etc.).
3. Outros usuários podem "endorsar" uma skill, apostando reputação/token para validar.
4. Se o endorsado cometer fraude, o “apostador” perde stake.
5. Perfis ganham pontuação social/profissional dinâmica, visível publicamente.
6. Tudo registrado em NFT soulbound com as skills validadas + endorsements.

---

## 🛠️ Stack Técnico

- **Civic Wallet** para onboarding e identidade.
- **Soulbound NFTs** para representar as skills.
- **Staking Contract** (ex: ERC-20 + reputação) para validações.
- **Frontend React** com perfil estilo Web3CV + “endorse-to-stake” UX.
- **Polygon/Base** como rede de baixo custo.

---

## 📈 Casos de Uso

- Devs Web3 validando conhecimento técnico com backing da comunidade.
- Traduções, design, redação — onde prova social conta mais que diploma.
- Mentores endossando mentorados com skin in the game.
- Comunidades Web3 filtrando quem é “reputável” com base no staking social.

---

# Pitch

## 🎯 Projeto: SkillPass

Um passaporte de habilidades com staking de reputação para validação descentralizada de talentos.

---

### 🧠 Problema

Profissionais autônomos e criadores enfrentam o desafio de provar competência. Currículos e perfis online são centralizados, fáceis de falsificar e pouco confiáveis — especialmente no Web3, onde identidades são pseudônimas.

---

### 💡 Solução

SkillPass é uma plataforma onde usuários podem:

- Criar perfil descentralizado usando Civic Embedded Wallet.
- Adicionar habilidades como NFTs soulbound.
- Receber endorsements de outros usuários que apostam tokens/reputação em suas skills.
- Construir reputação comprovada on-chain, validada por terceiros com “skin in the game”.

Endossar envolve risco: se o endossado engana ou entrega mal, o validador pode perder stake. Isso gera confiança criptoeconômica no processo de validação de habilidades.

---

### 🛠️ Como funciona

1. Usuário entra com a wallet Civic e cria seu perfil SkillPass.
2. Adiciona skills como “Solidity”, “UX Design”, “Tradução”, etc.
3. Colega ou mentor pode endossar essa skill, apostando tokens em garantia.
4. Skills e endorsements viram NFTs soulbound, compondo um perfil reputacional público.
5. Se um usuário agir de má fé, os endorsers podem ter penalidades.

---

### 🧩 Por que usar blockchain + Civic

- Identidade confiável com onboarding rápido usando Civic Embedded Wallet.
- Imutabilidade e interoperabilidade dos dados reputacionais.
- Incentivo/desincentivo on-chain para validar competências com responsabilidade.
- Uso em outros ecossistemas Web3: DAOs, grant systems, hiring.

---

### 📦 Stack (sugestão para hackathon)

- Civic Embedded Wallet para onboarding.
- Soulbound NFT (ERC-721) para representar cada skill.
- Smart Contract (Solidity / Foundry) com:
    - Registro de skills
    - Mecanismo de endorsement com staking
    - Penalização automática por denúncias comprovadas
- Frontend React com Tailwind para perfis, staking e skill visualization.
- Polygon ou Base como rede L2 barata e rápida.

---

### 📈 Impacto

- Facilita contratação e colaboração entre perfis anônimos ou globais.
- Estimula validação social descentralizada.
- Reduz fraude e fricção em plataformas de freelas, DAOs, hackathons.
- Base para passaportes Web3 de carreira, acopláveis em dApps e comunidades.

---

# Arquitetura Técnica

## 🏗️ Visão Geral

O SkillPass é composto por:

- **Frontend (React/Next.js):** interface para acessar, adicionar habilidades e endossar.
- **Smart Contracts (Solidity/Foundry):** lógica de registro de skills, staking, endorsements e penalidades.
- **Soulbound NFT Registry:** cada skill endossada vira um NFT intransferível vinculado ao usuário.
- **Civic Embedded Wallet:** login rápido, onboarding com identidade verificada.
- **Banco de dados leve (opcional):** cache de perfis públicos e skills para busca e indexação rápida (ex: Supabase).

---

## 🔄 Fluxo de Usuário

1. **Onboarding:** Usuário cria perfil com Civic Wallet, vinculando identidade ao endereço EVM.
2. **Adição de Habilidades:** Escolhe skills de catálogo ou adiciona livremente. Cada skill registrada via contrato, mintando NFT soulbound.
3. **Endosso com Stake:** Outro usuário valida a skill apostando tokens. Stake fica bloqueado em contrato, vinculado ao endorsement.
4. **Penalidades e Disputas:** Denúncias podem levar a penalidades para endorsers em caso de fraude.
5. **Visualização Pública:** Perfis acessíveis em `/profile/:address` com skills, reputação e endorsers.

---

## 🔐 Contratos Inteligentes (Módulos)

- **SkillPassRegistry:** Registro de perfis, habilidades e NFTs.
- **EndorsementStaking:** Função de endorseSkill() com valor, mapeamento de endossos, desbloqueio e penalidades.
- **SoulboundSkillNFT:** ERC-721 modificado (non-transferable), metadata dinâmica.

---

## 🧠 Extras (para hackathon)

- Score de reputação agregada (skills, stake, diversidade de validadores).
- Delegated endorsements (DAOs usando multisigs).
- Gamificação com XP/Level por skill.
- Leaderboards por área.

---

# 🎨 Documentação de Telas e UX — SkillPass dApp

## 1. Tela Inicial / Landing Page

- Hero com slogan: “Seu passaporte de habilidades na Web3”
- Botão: “Criar SkillPass com Wallet Civic”
- Visualização de skills de outros usuários (Leaderboard)
- Explicação rápida: “Skills + Endossos + Reputação Stakeada”
- Footer com links (GitHub, hackathon, FAQ)

---

## 2. Perfil Público (`/profile/:address`)

- Banner com wallet + identidade (via Civic)
- Lista de habilidades:
    - Nome da skill
    - Quantidade de endossos
    - Valor total stakeado
    - Endossantes (avatars/addresses)
    - Badge de reputação (bronze, prata, ouro)
- Botão: “Endossar uma skill”

---

## 3. Dashboard do Usuário (autenticado)

- Identidade Civic (nome/verificado ou pseudônimo)
- Lista de skills próprias (status, endossos recebidos)
- Opção de remover ou editar descrição
- Botão: “Adicionar nova skill”
- Botão: “Conectar outras wallets” (futuro)

---

## 4. Adicionar Skill

- Campo: Nome da Skill (autocomplete)
- Campo: Descrição breve (opcional)
- Botão: “Adicionar”
- Feedback: “Skill adicionada com sucesso! Agora peça endossos.”

---

## 5. Modal de Endosso

- Visualização do perfil e da skill
- Campo: Valor a ser stakeado (ex: 0.01 ETH mínimo)
- Info: “Seu stake estará travado enquanto essa skill for válida. Se ela for fraudulenta, você pode ser penalizado.”
- Botão: Confirmar (chama endorseSkill)
- Feedback de sucesso com tx hash

---

## 6. Leaderboard / Descoberta

- Filtros por área: Dev, Design, Community, Translators, etc.
- Cards com:
    - Nome do usuário
    - Skills mais fortes
    - Score total (stake + endossos)
    - Link para perfil

