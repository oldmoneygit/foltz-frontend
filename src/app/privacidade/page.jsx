'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield, Lock, Eye, UserCheck, Database, CreditCard, FileText, AlertCircle } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 pt-6 md:pt-8 pb-12">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-brand-yellow" />
              <h1 className="text-3xl md:text-5xl font-black text-white">
                Política de Privacidade
              </h1>
            </div>
            <p className="text-white/60 text-base md:text-lg">
              Sua privacidade é importante para nós. Veja como protegemos seus dados.
            </p>
            <p className="text-white/40 text-sm mt-2">
              Última atualização: Outubro 2025
            </p>
          </div>

          {/* Security Banner */}
          <div className="mb-12 bg-gradient-to-r from-green-500/20 to-green-500/0 border border-green-500/30 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Lock className="w-12 h-12 text-green-500 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Sua informação está protegida
                </h2>
                <p className="text-white/80">
                  Utilizamos criptografia SSL de 256 bits e as melhores práticas de segurança para proteger seus dados pessoais e financeiros.
                </p>
              </div>
            </div>
          </div>

          {/* Coleta de dados */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Database className="w-7 h-7 text-brand-yellow" />
              Informações que coletamos
            </h2>
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-bold mb-3">Dados pessoais:</h3>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>Nome completo e dados de contato (email, telefone)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>Endereço de envio e cobrança</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>Informações de conta (se criar uma)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-3">Dados de transação:</h3>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>Histórico de compras e pedidos</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>Métodos de pagamento (criptografados e tokenizados)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>Informações de envio e rastreamento</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-bold mb-3">Dados técnicos:</h3>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>Endereço IP e tipo de navegador</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>Cookies e dados de navegação</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>Dispositivo e sistema operacional</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Uso da informação */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Eye className="w-7 h-7 text-brand-yellow" />
              Como usamos suas informações?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: <UserCheck className="w-6 h-6 text-brand-yellow" />,
                  title: 'Processar pedidos',
                  desc: 'Para gerenciar suas compras, envios e comunicações relacionadas',
                },
                {
                  icon: <CreditCard className="w-6 h-6 text-brand-yellow" />,
                  title: 'Processamento de pagamentos',
                  desc: 'Para processar transações de forma segura com nossos provedores',
                },
                {
                  icon: <Shield className="w-6 h-6 text-brand-yellow" />,
                  title: 'Prevenção de fraude',
                  desc: 'Para detectar e prevenir atividades fraudulentas ou suspeitas',
                },
                {
                  icon: <FileText className="w-6 h-6 text-brand-yellow" />,
                  title: 'Melhorar serviços',
                  desc: 'Para personalizar sua experiência e melhorar nossos produtos',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-start gap-3 mb-2">
                    {item.icon}
                    <h3 className="text-white font-bold">{item.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Segurança de dados */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Lock className="w-7 h-7 text-brand-yellow" />
              Medidas de segurança
            </h2>
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <div className="space-y-4">
                {[
                  {
                    title: 'Criptografia SSL/TLS',
                    desc: 'Toda informação sensível é transmitida mediante criptografia de 256 bits.',
                  },
                  {
                    title: 'Tokenização de pagamentos',
                    desc: 'Não armazenamos informações completas de cartões de crédito. Usamos tokens seguros.',
                  },
                  {
                    title: 'Servidores protegidos',
                    desc: 'Nossos servidores estão protegidos com firewalls e sistemas de detecção de intrusos.',
                  },
                  {
                    title: 'Acesso limitado',
                    desc: 'Apenas pessoal autorizado tem acesso a dados pessoais, sob políticas rigorosas.',
                  },
                  {
                    title: 'Auditorias regulares',
                    desc: 'Realizamos auditorias de segurança periódicas e atualizações constantes.',
                  },
                  {
                    title: 'Conformidade normativa',
                    desc: 'Cumprimos com as regulamentações de proteção de dados vigentes na Argentina.',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-brand-yellow flex-shrink-0 mt-2"></div>
                    <div>
                      <h3 className="text-white font-bold mb-1">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compartilhar informação */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Compartilhar informações com terceiros
            </h2>
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <p className="text-white/80 mb-4">
                Compartilhamos suas informações com terceiros apenas nos seguintes casos:
              </p>
              <div className="space-y-3">
                {[
                  'Provedores de envio para entregar seu pedido',
                  'Processadores de pagamento para completar transações',
                  'Serviços de marketing (apenas com seu consentimento explícito)',
                  'Autoridades legais quando for requerido por lei',
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="text-brand-yellow text-xl">→</span>
                    <p className="text-white/80 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-white/80 text-sm">
                  <strong className="text-green-400">Garantia:</strong> Nunca vendemos ou alugamos suas informações pessoais para terceiros com fins comerciais.
                </p>
              </div>
            </div>
          </div>

          {/* Seus direitos */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Seus direitos sobre seus dados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Acesso',
                  desc: 'Você pode solicitar uma cópia de todos os dados que temos sobre você',
                },
                {
                  title: 'Retificação',
                  desc: 'Você pode atualizar ou corrigir informações incorretas a qualquer momento',
                },
                {
                  title: 'Eliminação',
                  desc: 'Você pode solicitar a eliminação de seus dados pessoais',
                },
                {
                  title: 'Portabilidade',
                  desc: 'Você pode solicitar seus dados em formato legível por máquina',
                },
                {
                  title: 'Oposição',
                  desc: 'Você pode se opor ao processamento de seus dados para fins de marketing',
                },
                {
                  title: 'Limitação',
                  desc: 'Você pode solicitar limitar o processamento de seus dados em certos casos',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-brand-yellow font-bold mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cookies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Uso de Cookies
            </h2>
            <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <p className="text-white/80 mb-4">
                Utilizamos cookies para melhorar sua experiência de navegação. Cookies são pequenos arquivos armazenados em seu dispositivo que nos ajudam a:
              </p>
              <ul className="space-y-2 text-white/80 text-sm mb-6">
                <li className="flex gap-2">
                  <span className="text-brand-yellow">✓</span>
                  <span>Lembrar suas preferências e configurações</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-yellow">✓</span>
                  <span>Manter sua sessão iniciada</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-yellow">✓</span>
                  <span>Analisar o tráfego e uso do site</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-yellow">✓</span>
                  <span>Personalizar conteúdo e anúncios</span>
                </li>
              </ul>
              <p className="text-white/60 text-sm">
                Você pode configurar seu navegador para rejeitar cookies, embora isso possa afetar a funcionalidade do site.
              </p>
            </div>
          </div>

          {/* Mudanças na política */}
          <div className="mb-8 bg-gradient-to-br from-orange-500/10 to-orange-500/0 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-orange-500/30">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Mudanças nesta política
                </h3>
                <p className="text-white/80 mb-3">
                  Nos reservamos o direito de atualizar esta política de privacidade a qualquer momento. Mudanças importantes serão notificadas através de:
                </p>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Email para seu endereço registrado</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Aviso destacado em nosso site</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-gradient-to-r from-brand-yellow/10 to-yellow-500/10 border border-brand-yellow/30 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Dúvidas sobre privacidade?
            </h3>
            <p className="text-white/80 mb-6">
              Se você tiver dúvidas sobre esta política ou sobre como lidamos com seus dados, não hesite em nos contatar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:contato@foltz.com.br"
                className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <Shield className="w-5 h-5" />
                Contatar sobre privacidade
              </a>
              <a
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Suporte geral
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
