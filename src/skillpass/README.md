# SkillPass — Skills Passport with Reputation Staking

🚀 **REFACTORED FROM AUTHORA PAYMENT LINKS TO SKILLPASS REPUTATION SYSTEM** 🚀

This project has been successfully refactored from a payment links platform (Authora) to a skills validation platform with reputation staking (SkillPass).

## Key Changes Made:
- ✅ Updated branding from Authora to SkillPass
- ✅ Replaced payment links with skills management
- ✅ Added endorsement system with crypto staking
- ✅ Created reputation scoring algorithm  
- ✅ Built leaderboards for skill rankings
- ✅ Transformed dashboard for skills management
- ✅ Updated all API routes for skills/endorsements
- ✅ Maintained Civic Auth integration

---

"SkillPass" — passaporte de habilidades com staking de reputação para credibilidade
💡 Inspiração:
Gitcoin Passport quer provar que você é um humano confiável.

Mas e se a gente for além disso e criar um sistema onde suas skills/habilidades são validadas on-chain e outros usuários podem apostar reputação em você?

Pensa num "LinkedIn com skin in the game".

🚩 Problema real:
Em ambientes Web3 ou freelas, é difícil saber se alguém é confiável.

"Provar" que sabe algo é baseado em prints ou links de portfólio.

Recomendação/referência é centralizada e não comprovável.

Mesmo no Web2, freelancers sofrem com desconfiança em plataformas como Fiverr e Upwork.

✅ Solução: SkillPass — sistema de credenciais e endorsements com staking de reputação por terceiros
Como funciona:
Usuário entra com Civic Embedded Wallet e cria seu perfil.

Ele adiciona skills (ex: React, Solana dev, designer, tradutor, etc.).

Outros usuários (mentores, colegas, empresas):

Podem "endorsar" uma skill, apostando reputação/token para validar.

Se o endorsado cometer fraude ou enganar alguém, o "apostador" perde stake.

Os perfis ganham pontuação social/profissional dinâmica, visível publicamente.

Tudo fica registrado em NFT soulbound com as skills validadas + endorsements.

🛠️ Stack técnico:
Civic Wallet para onboarding e identidade.

Soulbound NFTs para representar as skills.

Staking Contract (ex: ERC-20 + reputação) para validações.

Frontend React com perfil estilo Web3CV + "endorse-to-stake" UX.

Polygon/Base como rede de baixo custo.

📈 Casos de uso:
Devs Web3 validando conhecimento técnico com backing da comunidade.

Traduções, design, redação — onde prova social conta mais que diploma.

Mentores endossando seus mentorados com skin in the game.

Comunidades Web3 filtrando quem é "reputável" com base no staking social.

# Pitch

🎯 Projeto: SkillPass
Um passaporte de habilidades com staking de reputação para validação descentralizada de talentos

🧠 Problema
Em um mundo cada vez mais remoto e descentralizado, profissionais autônomos e criadores enfrentam um desafio constante: como provar que são realmente bons no que fazem.
Atualmente, currículos e perfis online são centralizados, fáceis de falsificar e pouco confiáveis — especialmente no ecossistema Web3, onde identidades são pseudônimas.

Como validar que alguém domina Solana, escreve bons contratos ou é um ótimo designer — sem confiar em uma plataforma centralizada ou em prints de portfólio?

💡 Solução
SkillPass é uma plataforma onde usuários podem:

Criar um perfil descentralizado usando Civic Embedded Wallet

Adicionar suas habilidades como NFTs soulbound

Receber endorsements de outros usuários que apostam tokens/reputação em suas skills

Construir uma reputação comprovada on-chain, validada por terceiros com "skin in the game"

Endossar alguém envolve risco: se o endossado engana ou entrega mal, o validador pode perder stake. Isso gera uma camada de confiança criptoeconômica no processo de validação de habilidades.

🛠️ Como funciona
Usuário entra com a wallet Civic e cria seu perfil SkillPass

Ele adiciona skills como "Solidity", "UX Design", "Tradução", etc.

Um colega ou mentor pode endossar essa skill, apostando tokens em garantia

Skills e endorsements viram NFTs soulbound, compondo um perfil reputacional público

Se um usuário agir de má fé, os endorsers podem ter penalidades

🧩 Por que usar blockchain + Civic
Identidade confiável com onboarding rápido usando Civic Embedded Wallet

Imutabilidade e interoperabilidade dos dados reputacionais

Mecanismo de incentivo/desincentivo on-chain para validar competências com responsabilidade

Possibilidade de uso em outros ecossistemas Web3: DAOs, grant systems, hiring

📦 Stack (sugestão para hackathon)
Civic Embedded Wallet para onboarding

Soulbound NFT (ERC-721) para representar cada skill

Smart Contract (Solidity / Foundry) com:

Registro de skills

Mecanismo de endorsement com staking

Penalização automática por denúncias comprovadas

Frontend React com Tailwind para perfis, staking e skill visualization

Polygon ou Base como rede L2 barata e rápida

📈 Impacto
Facilita contratação e colaboração entre perfis anônimos ou globais

Estimula um ecossistema de validação social descentralizada

Reduz fraude e fricção em plataformas de freelas, DAOs, hackathons

Pode ser base para passaportes Web3 de carreira, acopláveis em dApps e comunidades

# Arquitetura tecnica

🏗️ Arquitetura Técnica — SkillPass
📌 Visão Geral
O SkillPass é composto por:

Frontend (React/Next.js): interface onde usuários acessam, adicionam habilidades e endossam outras pessoas.

Smart Contracts (Solidity/Fountdry): lida com a lógica de registro de skills, staking, endorsements e penalidades.

Soulbound NFT Registry: cada skill endossada vira um NFT intransferível vinculado ao usuário.

Civic Embedded Wallet: usada para login rápido, onboarding com identidade verificada e vinculação do perfil.

Banco de dados leve (opcional): cache de perfis públicos e skills para busca e indexação rápida (ex: Supabase).

🔄 Fluxo de Usuário
1. Onboarding com Civic Embedded Wallet
Usuário acessa a dApp e cria seu perfil com uma Civic Wallet.

Civic vincula identidade verificada ou pseudônima ao endereço EVM (ex: via JWT/Access Token na embedded wallet).

Um novo perfil é inicializado no contrato SkillPassRegistry.

2. Adição de Habilidades
Usuário escolhe skills de um catálogo ou adiciona livremente (ex: "Solidity", "UX", "Community Mod").

Cada skill é registrada no contrato via função addSkill(address user, string skillName).

Um NFT soulbound é mintado (ERC-721 com extensão SBT) e vinculado ao usuário com metadata da skill.

3. Endosso com Stake
Outro usuário pode validar a skill chamando endorseSkill(address user, string skillName) com um valor de stake (em token nativo ou ERC20).

O stake fica bloqueado em contrato, vinculado àquele endorsement.

Metadata do NFT é atualizada para refletir o número de endorsers e total staked.

4. Penalidades e Disputas (fase 2)
Caso alguém denuncie um usuário (ex: trabalho fraudado ou má conduta), uma votação ou arbitragem externa pode ser usada.

Se a fraude for confirmada, os endorsers perdem o stake parcial ou total (penalty pool).

Mecanismo opcional de slashing automático via oracle (fase futura).

5. Visualização pública
Qualquer pessoa pode acessar /profile/:address para visualizar skills, score de reputação e endorsers.

Possível gerar badge NFT ou link compatível com plataformas Web3 (Farcaster, Gitcoin, etc.)

🔐 Contratos Inteligentes (Módulos)
SkillPassRegistry

Registro de perfis, habilidades e NFTs

Mintagem de NFTs soulbound por skill

Indexação de dados por endereço

EndorsementStaking

Função de endorseSkill() com valor

Mapeamento de quem endorsou quem e quanto

Desbloqueio, penalidades e disputas

SoulboundSkillNFT

ERC-721 modificado (non-transferable)

Metadata dinâmico com número de endorsers, total stake, descrição, etc.

Extensível com layer visual para UI

🧠 Extra (para impressionar em hackathon)
Score de reputação agregada = função de número de skills, volume de stake, diversidade de validadores

Delegated endorsements: DAOs podem endossar usando multisigs

Gamificação com XP/Level por skill

Leaderboards por área (devs, designers, tradutores, etc.)

#  🎨 Documentação de Telas e UX — SkillPass dApp
🧾 1. Tela Inicial / Landing Page
Objetivo: Introduzir o projeto, chamar o usuário para conectar e criar seu passaporte de habilidades.

Componentes:

Hero com slogan: "Seu passaporte de habilidades na Web3"

Botão: "Criar SkillPass com Wallet Civic"

Destaques:

Visualização de skills de outros usuários (Leaderboard de Skills)

Explicação rápida: "Skills + Endossos + Reputação Stakeada"

Footer com links (GitHub, hackathon, FAQ)

👤 2. Perfil Público (/profile/:address)
Objetivo: Visualizar todas as habilidades de um usuário, quem o endossou e o quanto foi stakeado.

Componentes:

Banner com wallet + identidade (se disponível via Civic)

Lista de habilidades:

Nome da skill

Quantidade de endossos

Valor total stakeado

Endossantes (avatars ou addresses truncados)

Badge visual de reputação (ex: bronze, prata, ouro)

Botão: "Endossar uma skill" → leva para modal de stake

🧑‍💼 3. Dashboard do Usuário (autenticado)
Objetivo: Usuário gerencia seu SkillPass.

Componentes:

Identidade Civic (nome/verificado ou pseudônimo)

Lista de skills próprias:

Status (validada ou pendente)

Endossos recebidos

Opção de remover ou editar descrição

Botão: "Adicionar nova skill"

Botão: "Conectar outras wallets" (futuro)

➕ 4. Adicionar Skill
Fluxo Modal / Página simples

Campo: Nome da Skill (autocomplete com sugestões)

Campo: Descrição breve (opcional)

Botão: "Adicionar"

Feedback: "Skill adicionada com sucesso! Agora peça endossos."

🤝 5. Modal de Endosso
Aparece ao clicar em "Endossar skill" de outro usuário

Visualização do perfil do usuário e da skill

Campo: Valor a ser stakeado (ex: 0.01 ETH mínimo)

Info: "Seu stake estará travado enquanto essa skill for válida. Se ela for fraudulenta, você pode ser penalizado."

Botão: Confirmar (chama endorseSkill)

Feedback de sucesso com tx hash

🏆 6. Leaderboard / Descoberta
Objetivo: Navegar por usuários e skills com maior reputação

Filtros por área: Dev, Design, Community, Translators, etc

Cards com:

Nome do usuário

Skills mais fortes

Score total (soma de stake + endossos)

Link para perfil