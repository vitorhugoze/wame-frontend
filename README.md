# WAME — WhatsApp API SaaS

SaaS completo para automação de mensagens via WhatsApp, desenvolvido para aplicar na prática conhecimentos conceituais em um cenário real — cobrindo desde o provisionamento de infraestrutura na Oracle Cloud até integração de pagamentos e pipelines de CI/CD.

## 🔥 O que este projeto faz

- Interface responsiva em **SvelteKit** + **TailwindCSS** + **DaisyUI**
- Autenticação de usuário com **Better Auth** (email/senha) e reset de senha via **Nodemailer**
- Checkout e gestão de assinaturas com **Stripe**
- Dashboard de assinaturas e geração de token de API
- Backend em **Golang** para processamento e integração com WhatsApp
- Documentação de API integrada via **Swagger UI** em `/docs`
- Banco de dados **PostgreSQL** via pool de conexões
- Infraestrutura provisionada na **Oracle Cloud**
- Pipeline de CI/CD com **Jenkins** e containers **Docker**

## ⚙️ Stack

| Camada        | Tecnologia                        |
|---------------|-----------------------------------|
| Frontend      | SvelteKit, TailwindCSS, DaisyUI   |
| Backend       | Golang                            |
| Banco de dados| PostgreSQL                        |
| Pagamentos    | Stripe                            |
| Cloud         | Oracle Cloud                      |
| CI/CD         | Jenkins, Docker                   |
| Extras        | GSAP, Lenis, Nodemailer, Swagger  |