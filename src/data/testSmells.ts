export default [
  {
    category: "Title Smells",
    items: [
      {
        title: "Untitled Feature",
        description: "O smell 'Untitled Feature' é caracterizado pela ausência de título em um arquivo .feature.",
        consequences: [
          "Ambiguidade: objetivo da funcionalidade fica pouco claro.",
          "Rastreabilidade reduzida: dificulta a associação entre cenários e requisitos.",
          "Desalinhamento e comunicação falha: risco de divergência entre intenção e implementação e prejuízo no entendimento entre equipes."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/271eb48e-5ebd-4315-a03e-8783d4d8c501/image.png"
      },
      {
        title: "Duplicate Feature Title",
        description: "O smell 'Duplicate Feature Title' é caracterizado pela duplicação de um título de funcionalidade em arquivos .feature distintos.",
        consequences: [
          "Confusão de escopo: dificulta a distinção entre funcionalidades diferentes.",
          "Rastreabilidade prejudicada: complica a identificação de qual funcionalidade está sendo avaliada.",
          "Interpretação incorreta: aumenta o risco de erros ao analisar os resultados dos testes."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/fa5a5838-c3d5-4f81-983b-f0e40fb5bfb5/image.png"
      },
      {
        title: "Duplicate Scenario Title",
        description: "O smell 'Duplicate Scenario Title' é caracterizado pela duplicação de um título de cenário em um mesmo arquivo .feature ou em arquivos distintos.",
        consequences: [
          "Confusão nos resultados: dificulta entender qual cenário foi executado ou falhou.",
          "Inconsistência: dificulta entender qual é o comportamento esperado.",
          "Rastreabilidade comprometida: dificulta ligar cenários aos requisitos."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/be271357-988b-46b8-b8af-ba787825fec2/image.png"
      }
    ]
  },
  {
    category: "Background Smells",
    items: [
      {
        title: "Absence of Background",
        description: "O smell 'Absence of Background' ocorre quando múltiplos cenários repetem as mesmas precondições dentro de um mesmo arquivo .feature e o recurso Background não é utilizado para agrupar essas precondições duplicadas.",
        consequences: [
          "Redundância de código: aumenta de forma desnecessária o tamanho do arquivo.",
          "Redução da clareza: passos repetidos desviam o foco da lógica de teste.",
          "Dificuldade de manutenção: mudanças nas precondições exigem atualizações em vários cenários."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/b95c7f2d-d02e-42aa-a54e-73aa41ddbe5b/image.png"
      }
    ]
  },
  {
    category: "Tag Smells",
    items: [
      {
        title: "Cryptic Tag",
        description: "O smell 'Cryptic Tag' ocorre quando uma tag usada em um cenário ou funcionalidade não é clara ou não comunica seu propósito.",
        consequences: [
          "Ambiguidade: dificulta compreender a finalidade da tag.",
          "Manutenção complexa: torna difícil identificar onde e por que a tag é usada.",
          "Erros na organização: prejudica a categorização e execução dos testes."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/d5135c38-f9f9-408f-a00d-f9aeab6a5148/image.png"
      },
      {
        title: "Dead Feature",
        description: "O smell 'Dead Feature' ocorre quando um arquivo .feature contém cenários desatualizados ou obsoletos, que são marcados com tags como @deprecated, mas permanecem no projeto sem utilidade.",
        consequences: [
          "Acúmulo de código obsoleto: torna o projeto mais pesado e difícil de manter.",
          "Confusão para os testadores: pode gerar dúvida sobre a relevância dos cenários ao executar os testes.",
          "Perda de foco: desvia a atenção de funcionalidades ativas e importantes."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/42c70a54-d6ca-4839-9fc5-7ed96cc7dda4/image.png"
      },
      {
        title: "Vicious Tag",
        description: "O smell 'Vicious Tag' ocorre quando uma tag é repetida em todos os cenários de um arquivo .feature.",
        consequences: [
          "Redundância de código: aumenta o tamanho e reduz a legibilidade do arquivo.",
          "Manutenção trabalhosa: mudanças na tag exigem atualizações em todos os cenários.",
          "Propensão a erros: maior risco de inconsistências ao gerenciar tags manualmente."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/6f57f316-1301-4b31-976c-db74ebe77f1a/image.png"
      }
    ]
  },
  {
    category: "Step Smells",
    items: [
      {
        title: "Duplicate Step",
        description: "O smell 'Duplicate Step' ocorre quando um mesmo passo é duplicado dentro de um cenário.",
        consequences: [
          "Redundância de código: aumenta o tamanho.",
          "Execução duplicada: executa um mesmo passo múltiplas vezes de forma desnecessária."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/c6f84360-5d9b-4fc2-a449-7189e00950d6/image.png"
      },
      {
        title: "Malformed Test",
        description: "O smell 'Malformed Test' ocorre quando as palavras reservadas Given, When ou Then são repetidas indevidamente ao invés de usar And para continuidade, ou quando um cenário não inclui as palavras reservadas When ou Then essenciais para sua estrutura.",
        consequences: [
          "Quebra de legibilidade: dificulta entender a lógica do teste devido à inconsistência na estrutura.",
          "Perda de clareza no objetivo: cenários sem When ou Then ficam incompletos e ambíguos."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/b3d0e69a-d3f6-4895-afd7-99b3d3cd942a/image.png"
      },
      {
        title: "Starting With The Left Foot",
        description: "O smell 'Starting With The Left Foot' ocorre quando um cenário começa com And, But ou Then, e não com Given ou When.",
        consequences: [
          "Confusão no entendimento: dificulta identificar o contexto inicial do teste.",
          "Inconsistência estrutural: quebra as boas práticas definidas pela documentação do Cucumber.",
          "Diagnóstico trabalhoso: exige revisões adicionais do Background para entender o cenário."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/21f21fc1-9496-4156-8e9f-a79a37c86a1c/image.png"
      },
      {
        title: "Duplicate Test Case",
        description: "O smell 'Duplicate Test Case' ocorre quando o conteúdo de um cenário é idêntico a outro, seja no mesmo arquivo .feature ou em arquivos distintos.",
        consequences: [
          "Redundância desnecessária: aumenta o tamanho do arquivo sem agregar valor.",
          "Manutenção ineficiente: alterações precisam ser replicadas em cenários idênticos.",
          "Resultados confusos: relatórios de testes podem conter duplicatas, dificultando a análise."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/5573e075-2e9b-4e93-baf1-0662774bdfb1/image.png"
      }
    ]
  },
  {
    category: "Table Smells",
    items: [
      {
        title: "Incomplete Table",
        description: "O smell 'Incomplete Table' ocorre quando uma tabela está incompleta, sem cabeçalho, sem corpo ou com valores mal formatados na horizontal.",
        consequences: [
          "Erros na automação: ferramentas podem processar incorretamente a tabela mal formatada.",
          "Confusão na interpretação: dificulta o entendimento da estrutura e dos dados da tabela.",
          "Perda de clareza: compromete a lógica do teste e a rastreabilidade das informações."
        ],
        image: "https://t9013506324.p.clickup-attachments.com/t9013506324/82ffa006-7e6c-40c8-ab72-3520db8f0703/image.png"
      }
    ]
  }
];