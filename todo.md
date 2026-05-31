# Savoir Estética & Massagem — TODO

## Banco de Dados / Schema
- [x] Tabela `services` (serviços: nome, categoria, descrição, duração, preço, ativo)
- [x] Tabela `appointments` (agendamentos: cliente, serviço, data, hora, status, email, telefone)
- [x] Tabela `gallery` (galeria: imagem antes, imagem depois, categoria, descrição)
- [x] Tabela `testimonials` (depoimentos: nome, avaliação, comentário, aprovado)
- [x] Tabela `business_hours` (horários de funcionamento por dia da semana)
- [x] Executar migrations no banco

## Backend (tRPC)
- [x] Router `services`: listar, criar, editar, deletar serviços
- [x] Router `appointments`: criar agendamento, listar, atualizar status, cancelar
- [x] Router `gallery`: listar, upload, deletar imagens
- [x] Router `testimonials`: listar aprovados, criar, aprovar/rejeitar (admin)
- [x] Notificação para proprietária ao novo agendamento
- [x] Seed de serviços iniciais

## Frontend — Landing Page
- [x] Configurar paleta de cores (cinza, dourado, rose gold) no index.css
- [x] Navbar responsiva com logo, links de navegação e botão WhatsApp
- [x] Hero section: nome da clínica, 8 anos de experiência, Itapira/SP, CTA agendamento
- [x] Seção "Sobre": Éricka Bertolazzo, diferenciais, equipamentos modernos
- [x] Seção "Serviços": cards por categoria (Faciais e Corporais)
- [x] Seção "Agendamento": formulário com serviço, data, horário, dados do cliente
- [x] Seção "Galeria": antes e depois com filtro por categoria
- [x] Seção "Depoimentos": carrossel com avaliações de clientes
- [x] Seção "Localização": mapa interativo Itapira/SP + horários de funcionamento
- [x] Seção "Contato": formulário + botão WhatsApp (19) 99881-3701
- [x] Footer com links e redes sociais
- [x] Botão flutuante WhatsApp
- [x] Design totalmente responsivo (mobile-first)
- [x] Logo real da Savoir no Navbar e Footer

## Painel Administrativo
- [ ] Rota protegida `/admin` (somente proprietária) — próxima fase
- [ ] Dashboard: resumo de agendamentos do dia/semana
- [ ] Gerenciar agendamentos: listar, confirmar, cancelar
- [ ] Gerenciar serviços: CRUD completo
- [ ] Gerenciar galeria: upload e exclusão de imagens
- [ ] Gerenciar depoimentos: aprovar/rejeitar

## Testes
- [x] Testes vitest para auth (logout)
- [x] Verificar TypeScript (0 erros)
- [ ] Testes vitest para routers de agendamento e serviços

## Entrega
- [ ] Checkpoint final site público
- [ ] Publicar site
