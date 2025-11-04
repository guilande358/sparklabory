import { useState } from "react";
import { Search, Book, Beaker, Plug, HelpCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import FloatingAssistant from "@/components/FloatingAssistant";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Book,
      title: "Introdução e Navegação",
      description: "Aprenda o básico sobre o ScienceHub",
      color: "text-primary",
      topics: [
        {
          question: "Como criar meu primeiro projeto?",
          answer: "Para criar um projeto, vá até a seção 'Projetos' no menu inferior e clique no botão '+'. Preencha as informações do projeto, como título, categoria e descrição. Você pode adicionar hipóteses e observações depois."
        },
        {
          question: "Como funciona o sistema de pontos?",
          answer: "Você ganha pontos ao completar projetos e experimentos. Cada projeto concluído vale 10 pontos e cada experimento finalizado vale 5 pontos. Acompanhe seu progresso na página inicial."
        },
        {
          question: "Como convidar membros para meu projeto?",
          answer: "Na página de detalhes do projeto, clique em 'Convidar Membro' e pesquise pelo nome do usuário que deseja adicionar. Membros podem visualizar e colaborar no projeto."
        }
      ]
    },
    {
      icon: Beaker,
      title: "Laboratório Virtual",
      description: "Guia completo sobre simulações",
      color: "text-accent",
      topics: [
        {
          question: "Como usar a simulação 3D?",
          answer: "No Laboratório Virtual, selecione o modo 3D no painel lateral. Use o mouse para rotacionar (clique e arraste), zoom (scroll) e ajuste os parâmetros no painel de controle. Clique em 'Play' para iniciar a simulação."
        },
        {
          question: "Qual a diferença entre 2D e 3D?",
          answer: "O modo 2D simula sistemas de partículas em tempo real, ideal para visualizar comportamentos dinâmicos. O modo 3D oferece visualização tridimensional interativa com controles avançados de câmera e manipulação de objetos."
        },
        {
          question: "Como exportar resultados da simulação?",
          answer: "Após executar a simulação, você pode capturar screenshots ou gerar relatórios PDF com os resultados. Use os botões de exportação no painel de controle do laboratório."
        }
      ]
    },
    {
      icon: Plug,
      title: "Integrações com Simuladores",
      description: "Conecte ferramentas externas",
      color: "text-secondary",
      topics: [
        {
          question: "Como conectar um simulador externo?",
          answer: "No Laboratório Virtual, clique em 'Conectar Simulador Externo'. Escolha o tipo de conexão (API, iframe ou WebSocket), insira a URL e configure as credenciais se necessário."
        },
        {
          question: "Quais simuladores são suportados?",
          answer: "Suportamos conexões via REST API, iframes incorporados e WebSockets para comunicação em tempo real. Consulte a documentação do simulador específico para detalhes de integração."
        },
        {
          question: "Como sincronizar dados em tempo real?",
          answer: "Use a opção WebSocket ao configurar o simulador externo. Isso permite sincronização bidirecional de dados e estados entre o ScienceHub e o simulador externo."
        }
      ]
    },
    {
      icon: HelpCircle,
      title: "Perguntas Frequentes",
      description: "Respostas rápidas para dúvidas comuns",
      color: "text-primary",
      topics: [
        {
          question: "O app funciona offline?",
          answer: "Não, o ScienceHub requer conexão com internet para sincronizar seus projetos, acessar o assistente IA e usar o laboratório virtual."
        },
        {
          question: "Como gerar relatórios científicos?",
          answer: "Na página de detalhes do projeto, clique em 'Gerar Relatório'. O assistente IA irá compilar suas hipóteses, observações e resultados em um relatório científico formatado que pode ser exportado em PDF."
        },
        {
          question: "Posso compartilhar meus projetos?",
          answer: "Sim! Você pode adicionar membros aos seus projetos através da opção 'Convidar Membro'. Os membros terão acesso aos detalhes e poderão colaborar com você."
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    topics: category.topics.filter(topic =>
      topic.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.topics.length > 0);

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            📚 Centro de Ajuda
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por palavras-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="space-y-4">
          {filteredCategories.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum resultado encontrado para "{searchQuery}"
              </CardContent>
            </Card>
          ) : (
            filteredCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-primary/20">
                        <Icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <div>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.topics.map((topic, topicIndex) => (
                        <AccordionItem key={topicIndex} value={`item-${index}-${topicIndex}`}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 shrink-0" />
                              <span className="text-sm font-medium">{topic.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                              {topic.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* AI Assistant Tip */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/20 shrink-0">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Não encontrou o que procurava?</p>
                <p className="text-sm text-muted-foreground">
                  Use o assistente IA no canto inferior direito para fazer perguntas específicas sobre sua dúvida!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Navigation />
      <FloatingAssistant context="Centro de Ajuda - O usuário está procurando suporte e informações sobre o ScienceHub" />
    </div>
  );
};

export default HelpCenter;
