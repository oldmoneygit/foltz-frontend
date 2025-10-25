'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HelpCircle, ChevronDown, Search } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      category: 'Produtos',
      questions: [
        {
          q: 'Os produtos são originais?',
          a: 'Sim! Todos os nossos produtos são 100% originais e autênticos. Trabalhamos apenas com fornecedores oficiais e garantimos a autenticidade de cada item.',
        },
        {
          q: 'Vocês têm garantia nos produtos?',
          a: 'Sim, todos os produtos têm garantia contra defeitos de fabricação. Se seu produto chegar com algum defeito, fazemos a troca sem custo adicional.',
        },
        {
          q: 'Todas as medidas estão disponíveis?',
          a: 'Trabalhamos com tamanhos do 36 ao 44. Se não encontrar seu tamanho, entre em contato conosco para verificar disponibilidade.',
        },
      ],
    },
    {
      category: 'Envios e Entregas',
      questions: [
        {
          q: 'Fazem envios para toda Argentina?',
          a: 'Sim, realizamos envios para todo o território argentino. O prazo de entrega varia: Buenos Aires (3-5 dias), Interior (7-12 dias).',
        },
        {
          q: 'Quanto tempo demora o envio?',
          a: 'Os prazos de entrega são: Buenos Aires e CABA: 3-5 dias úteis, Província de Buenos Aires: 5-7 dias úteis, Interior: 7-12 dias úteis.',
        },
        {
          q: 'Posso rastrear meu pedido?',
          a: 'Sim! Assim que seu pedido for despachado, você receberá um código de rastreamento para acompanhar em tempo real.',
        },
        {
          q: 'O envio tem custo?',
          a: 'Envios GRÁTIS para compras acima de ARS 50.000. Abaixo desse valor, o frete é calculado no checkout.',
        },
      ],
    },
    {
      category: 'Pagamentos',
      questions: [
        {
          q: 'Quais formas de pagamento aceitam?',
          a: 'Aceitamos cartões de crédito e débito (Visa, Mastercard, American Express), Mercado Pago, transferência bancária e PIX.',
        },
        {
          q: 'Posso parcelar?',
          a: 'Sim! Aceitamos parcelamento em até 12x sem juros através do Mercado Pago e cartões de crédito.',
        },
        {
          q: 'É seguro comprar na Foltz?',
          a: 'Totalmente seguro! Utilizamos criptografia SSL e processadores de pagamento certificados. Seus dados estão protegidos.',
        },
      ],
    },
    {
      category: 'Trocas e Devoluções',
      questions: [
        {
          q: 'Posso trocar ou devolver meu pedido?',
          a: 'Sim! Aceitamos trocas e devoluções em até 30 dias após o recebimento. O produto deve estar sem uso, com etiquetas e na embalagem original.',
        },
        {
          q: 'Como fazer uma troca de tamanho?',
          a: 'Entre em contato por WhatsApp ou email com seu número de pedido. Coordenamos a retirada e envio do novo tamanho sem custo.',
        },
        {
          q: 'Quem paga o frete da devolução?',
          a: 'Se a troca for por erro de tamanho, assumimos o frete. Para troca de modelo ou devolução, o custo é compartilhado.',
        },
        {
          q: 'Quando recebo meu reembolso?',
          a: 'Após recebermos e verificarmos o produto, o reembolso é processado em 5-7 dias úteis na mesma forma de pagamento.',
        },
      ],
    },
    {
      category: 'Conta e Pedidos',
      questions: [
        {
          q: 'Preciso criar uma conta para comprar?',
          a: 'Não é obrigatório, mas recomendamos criar uma conta para rastrear pedidos facilmente e receber ofertas exclusivas.',
        },
        {
          q: 'Como posso modificar meu pedido?',
          a: 'Se seu pedido ainda não foi despachado, entre em contato imediatamente por WhatsApp e faremos a modificação.',
        },
        {
          q: 'Posso cancelar meu pedido?',
          a: 'Sim! Você pode cancelar sem custo se ainda não foi despachado. Após o despacho, aplicam-se as políticas de devolução.',
        },
      ],
    },
    {
      category: 'Outros',
      questions: [
        {
          q: 'Têm loja física?',
          a: 'Atualmente operamos 100% online para oferecer os melhores preços. Fazemos entregas em toda Argentina.',
        },
        {
          q: 'Fazem atacado?',
          a: 'Sim! Oferecemos preços especiais para compras em grande quantidade. Entre em contato por WhatsApp para mais informações.',
        },
        {
          q: 'Como posso entrar em contato?',
          a: 'Pode nos contatar por WhatsApp, email (contato@foltz.com.br) ou redes sociais. Respondemos todos os dias das 9h às 21h.',
        },
      ],
    },
  ]

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Filter FAQs based on search
  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-6 md:pt-8 pb-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-brand-yellow" />
              <h1 className="text-3xl md:text-5xl font-black text-white">
                Perguntas Frequentes
              </h1>
            </div>
            <p className="text-white/60 text-base md:text-lg">
              Encontre respostas para as dúvidas mais comuns
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar pergunta..."
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/40 focus:border-brand-yellow focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold text-brand-yellow mb-4">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((item, questionIndex) => {
                    const globalIndex = `${categoryIndex}-${questionIndex}`
                    const isOpen = openIndex === globalIndex

                    return (
                      <div
                        key={questionIndex}
                        className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(globalIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="text-white font-bold pr-4">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-brand-yellow flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4 text-white/80 leading-relaxed border-t border-white/10 pt-4">
                            {item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* No results */}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-20">
              <HelpCircle className="w-20 h-20 text-white/20 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-white/60 mb-6">
                Tente outros termos de busca
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="bg-brand-yellow text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
              >
                Ver todas as perguntas
              </button>
            </div>
          )}

          {/* Ajuda adicional */}
          <div className="mt-12 bg-gradient-to-r from-brand-yellow/10 to-yellow-500/10 border border-brand-yellow/30 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Não encontrou o que procurava?
            </h3>
            <p className="text-white/80 mb-6">
              Nossa equipe está disponível para ajudar você!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Tenho%20uma%20pergunta"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="mailto:contato@foltz.com.br"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
