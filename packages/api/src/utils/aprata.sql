CREATE DATABASE IF NOT EXISTS `aprata` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `aprata`;

CREATE TABLE `aluno` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(80) NOT NULL,
  `rg` varchar(20) NOT NULL,
  `cpf` varchar(20) NOT NULL,
  `nome_mae` varchar(60) NOT NULL,
  `data_nascimento` date NOT NULL,
  `escola` varchar(60) DEFAULT NULL,
  `serie` varchar(10) DEFAULT NULL,
  `periodo` varchar(10) DEFAULT NULL,
  `status` tinyint(4) NOT NULL,
  `data_matricula` date DEFAULT NULL,
  `pessoa_info_codigo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `aluno` (`codigo`, `nome`, `rg`, `cpf`, `nome_mae`, `data_nascimento`, `escola`, `serie`, `periodo`, `status`, `data_matricula`, `pessoa_info_codigo`) VALUES
(1, 'Adilson Pereira de Souza', '14.655.152-6', '546.231.185-151', 'Josefina Alves Oliveira', '2006-10-14', 'E. E. Dr. Barbosa', '3º E.M.', 'Matutino', 1, '2023-11-03', 7),
(2, 'Ana Lívia Oliveira', '22.141.231-4', '472.290.598-36', 'Maria Aparecida dos Santos Melo', '2000-10-22', 'Etec Deputado Francisco Franco', '3° E.M.', 'Matutino', 1, '2023-11-03', 8),
(3, 'Carlos Miguel Aidar', '12.336.549-6', '231.235.465-97', 'Francisca Aidar Silva', '2005-05-01', 'IFSP', '2º EM', 'Vespertino', 1, '2023-11-02', 9),
(17, 'Luís Lopes de Araújo', '16.132.312-3', '564.641.212-31', 'Larissa Lopes Almeida', '2007-06-10', 'E.E. Dr Barbosa', '1º E.M.', 'Noturno', 1, '2023-11-04', 36),
(20, 'Gustavo Boim da Silva', '12.564.156-1', '151.512.156-81', 'Juliana Augusta da Silva', '2007-10-22', 'E.E. Dom Antônio de Azevedo Jr', '3° Médio', 'Matutino', 1, '2023-11-19', 39),
(21, 'Fabrício de Oliveira Filho', '56.451.512-1', '454.151.515-12', 'Gabriela de Oliveira', '2006-05-04', 'E.M. Carlos Emanuel', '2° Ensino ', 'Vespertino', 1, '2023-11-19', 40),
(22, 'Joelma Calipso', '51.515.151-5', '151.515.151-51', 'Joelminha Catarina', '2007-10-22', 'asDas', 'dfsad', 'Matutino', 1, '2023-11-26', 41);

CREATE TABLE `atribuicao` (
  `funcionario_codigo` int(11) NOT NULL,
  `cargo_codigo` int(11) NOT NULL,
  `data_atribuicao` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `atribuicao` (`funcionario_codigo`, `cargo_codigo`, `data_atribuicao`) VALUES
(1, 2, '2023-11-26'),
(1, 3, '2023-11-26'),
(2, 3, '2023-11-23'),
(4, 1, '2023-11-23'),
(5, 1, '2023-11-23'),
(5, 2, '2023-11-23'),
(6, 2, '2023-11-23'),
(9, 1, '2023-11-23'),
(9, 2, '2023-11-23');

CREATE TABLE `cargo` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(299) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `cargo` (`codigo`, `nome`, `descricao`) VALUES
(1, 'Professor', 'Cargo responsável por lecionar nas dependências internas da instituição.'),
(2, 'Orientador', 'Cargo responsável por acompanhar o aprendiz em suas funções na empresas.'),
(3, 'Administrativo', 'Cargo responsável por administrar internamente a instituição.');

CREATE TABLE `curso` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(60) NOT NULL,
  `sala` varchar(45) NOT NULL,
  `eixo` varchar(45) NOT NULL,
  `carga_horas` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `curso` (`codigo`, `nome`, `sala`, `eixo`, `carga_horas`, `status`) VALUES
(1, 'Aprendizagem em Recepção', 'Sala 3', 'Comunicação', 40, 1),
(2, 'Informática', 'Sala 3', 'Tecnologia', 120, 1),
(5, 'Técnicas em Controle de Qualidade', 'Sala 2', 'Segurança e Qualidade', 40, 1),
(6, 'Técnicas em Segurança do Trabalho', 'Sala 2', 'Segurança e Qualidade', 80, 1),
(7, ' Técnicas em Escritório', 'Sala 9', 'Administrativo', 120, 1),
(11, 'Programação de Computadores', 'Sala 10', 'Informática', 80, 1);

CREATE TABLE `empresa` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(80) NOT NULL,
  `cnpj` varchar(45) NOT NULL,
  `ie` varchar(45) NOT NULL,
  `proprietario` varchar(80) DEFAULT NULL,
  `pessoa_info_codigo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `empresa` (`codigo`, `nome`, `cnpj`, `ie`, `proprietario`, `pessoa_info_codigo`) VALUES
(2, 'Supermercados Dois Irmãos de Rancharia', '23.265.612/1216-51', '656231251122', 'Márcio Rodrigo Magurno', 2),
(3, 'Auto Elétrica São Manoel', '25.012.329/6556-12', '112012032059', 'Felipe Garcia Dias', 3);

CREATE TABLE `funcionario` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(80) NOT NULL,
  `cpf` varchar(20) NOT NULL,
  `data_nascimento` date NOT NULL,
  `status` tinyint(4) NOT NULL,
  `nome_usuario` varchar(45) DEFAULT NULL,
  `senha_usuario` varchar(255) DEFAULT NULL,
  `pessoa_info_codigo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `funcionario` (`codigo`, `nome`, `cpf`, `data_nascimento`, `status`, `nome_usuario`, `senha_usuario`, `pessoa_info_codigo`) VALUES
(1, 'Eduardo Rossetti dos Santos Melo', '104.230.235-65', '2000-10-22', 1, 'edurossetti', '$2b$08$bZbKsxuZxtLj2lvrckwhRuZC.EfXu9mIwLwACFSyoUYpB2duAwxR6', 4),
(2, 'Felipe Nogueira da Silva', '120.246.232-00', '1999-05-10', 1, 'felipenogueira', '$2b$08$O.Mli1oyAKKQvX9psPlk7OrCilphYpeRkUROZMw0dBPLcCMI2e0JO', 5),
(4, 'Aglaê Pereira Zaupa', '123.644.632-13', '1981-04-01', 1, 'aglaepereira', '$2b$08$VDD5vFjNvc.wGbvjmAs3lONrlGbmg1AzqG0.GhDuVNn9YND0dgbDa', 15),
(5, 'Mário Augusto Pazoti', '123.456.497-63', '1982-05-01', 1, 'mariopazoti', '$2b$08$4QHDu68Byt1..bfzOLRWCe0NZq12mtRbRzTR38x8fbc6vSpLN1mDC', 16),
(6, 'Renato Fernando Silva Gonçalves', '123.479.864-31', '1979-05-02', 1, 'renatogoncalves', '$2b$08$XZaAYjESRcJFSm/qALuNzeAaTYR3MdHVcI0FfRDg5djqaL.ChZ9Vm', 17),
(9, 'Vinicius Moroni Alves', '123.456.789-04', '1995-01-01', 1, 'viniciusalves', '$2b$08$HlJzSb1FBGOxCiHfBEBoeea3BhKdElhV6HQhxevrJVIMtMlE6OSRy', 21);

CREATE TABLE `inscricao` (
  `codigo` int(11) NOT NULL,
  `turma_codigo` int(11) NOT NULL,
  `aluno_codigo` int(11) NOT NULL,
  `data_inscricao` date NOT NULL,
  `status` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `inscricao` (`codigo`, `turma_codigo`, `aluno_codigo`, `data_inscricao`, `status`) VALUES
(23, 1, 1, '2023-11-23', 1),
(24, 1, 17, '2023-11-23', 1),
(25, 1, 20, '2023-11-23', 1),
(26, 6, 3, '2023-11-23', 1),
(27, 6, 2, '2023-11-23', 1),
(28, 6, 1, '2023-11-23', 1),
(29, 9, 17, '2023-11-23', 1),
(30, 9, 3, '2023-11-23', 1),
(31, 9, 2, '2023-11-23', 1),
(32, 1, 2, '2023-11-24', 1);

CREATE TABLE `frequencia` (
  `codigo` int(11) NOT NULL,
  `turma_codigo` int(11) NOT NULL,
  `curso_codigo` int(11) NOT NULL,
  `aluno_codigo` int(11) NOT NULL,
  `data_falta` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `orientador` (
  `codigo` int(11) NOT NULL,
  `empresa_codigo` int(11) NOT NULL,
  `funcionario_codigo` int(11) NOT NULL,
  `data_vinculacao` date NOT NULL,
  `status` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orientador` (`codigo`, `empresa_codigo`, `funcionario_codigo`, `data_vinculacao`, `status`) VALUES
(1, 2, 6, '2023-10-23', 1),
(2, 2, 5, '2023-11-19', 1),
(3, 3, 9, '2023-11-23', 1),
(4, 2, 9, '2023-11-24', 1);

CREATE TABLE `pessoa_info` (
  `codigo` int(11) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `email` varchar(45) NOT NULL,
  `endereco` varchar(60) NOT NULL,
  `bairro` varchar(60) NOT NULL,
  `cidade` varchar(60) NOT NULL,
  `cep` varchar(10) NOT NULL,
  `uf` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `pessoa_info` (`codigo`, `telefone`, `email`, `endereco`, `bairro`, `cidade`, `cep`, `uf`) VALUES
(2, '(18) 3265-1780', 'doisirmaos.supermercados@contato.com', 'Rua Felipe Camarão, 995', 'Vila Nova', 'Rancharia', '19600-000', 'SP'),
(3, '(11) 3254-8333', 'saomanoel.autoeletrica@contato.com', 'Avenida Pedro de Toledo, 500', 'Centro', 'Martinópolis', '15770-000', 'SP'),
(4, '(18) 99645-4493', 'edurossetti@hotmail.com', 'Rua José Pereira Dutra, 140', 'Jardim Europa', 'Rancharia', '19600-000', 'SP'),
(5, '(18) 99754-6321', 'felipenogueira@gmail.com', 'Rua Ademar de Barros, 20', 'Vila Industrial', 'Rancharia', '19600-000', 'SP'),
(7, '(18) 99647-9895', 'karenoliveira10@gmail.com', 'Rua Carlos Almeida, 45', 'Vila Cantizani', 'Rancharia', '19600-000', 'SP'),
(8, '(18) 99645-4493', 'analivia@contato.com', 'Rua José Pereira Dutra, 140', 'Jardim América', 'Rancharia', '19600-000', 'SP'),
(9, '(18) 99781-6321', 'aidarfrancisca@gmail.com', 'Rua Adelaide Cristin, 80', 'Jardim Europa', 'Rancharia', '19600-000', 'SP'),
(15, '(18) 99756-4810', 'aglaepereirazaupa@contato.com', 'Rua José Francisco Cavaleiro', 'Jardim Alvorada', 'Presidente Prudente', '15478-001', 'SP'),
(16, '(18) 99784-6516', 'mariopazoti@gmail.com', 'Rua Tenente Augusto Bezerra', 'Jardim Primavera', 'Presidente Prudente', '19456-000', 'SP'),
(17, '(18) 99765-4631', 'renatogoncalves@contato.com', 'Rua Coronel Barbosa, 40', 'Jardim Beethoven', 'Presidente Prudente', '32165-463', 'SP'),
(18, '(18) 99789-6541', 'mateus@contato.com', 'Rua Paulino César, 98', 'Jardim Yasmim', 'Rancharia', '19600-000', 'SP'),
(21, '(18) 99647-1620', 'alvesve17@gmail.com', 'Av Coronel José Soares Marcondes, 2202', 'Vila Euclides', 'Presidente Prudente', '19013-050', 'SP'),
(36, '(18) 99645-4479', 'luislopes@contato.com', 'Rua Manoel Nóbrega, 140', 'Jardim Carlos Emanuel', 'Rancharia', '19600-000', 'SP'),
(39, '(18) 99745-6489', 'gustavoboimsilva@contato.com', 'Rua Joacir Medeiros, 56', 'Jardim Amaro', 'Raccharia', '19600-000', 'SP'),
(40, '(18) 99465-5621', 'fabriciooliveira@contato.com', 'Rua Heitor Xavier', 'Bairro Primavera', 'Rancharia', '19600-000', 'SP'),
(41, '(85) 48548-4185', 'fa@com.csom', 'Rua X', 'Biacxas', 'asdfasd', '89484-848', 'AC');

CREATE TABLE `relatorio_aprendiz` (
  `codigo` int(11) NOT NULL,
  `funcionario_codigo` int(11) NOT NULL,
  `aluno_codigo` int(11) NOT NULL,
  `data_relatorio` date NOT NULL,
  `conteudo` longtext NOT NULL,
  `titulo` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `relatorio_aprendiz` (`codigo`, `funcionario_codigo`, `aluno_codigo`, `data_relatorio`, `conteudo`, `titulo`) VALUES
(2, 9, 3, '2023-11-30', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea beatae omnis unde alias quis eum, dolores quo id dicta vero voluptates vel, quasi cum recusandae provident similique a rerum molestiae at consequatur ad. Perspiciatis, nobis voluptatem quis dolores laudantium accusamus id corrupti voluptatum magni reiciendis debitis omnis mollitia eum at iusto, nesciunt ipsam culpa, exercitationem sapiente ipsum quasi suscipit. Quo dolores cumque dolorum quae reprehenderit deleniti necessitatibus, commodi autem, nisi inventore repellendus voluptatibus maxime accusantium nihil illum, qui quia porro praesentium. Quae impedit sequi error consectetur nemo ea eos suscipit, saepe, sed cupiditate odit earum non laudantium voluptatem quos nobis reprehenderit incidunt excepturi quisquam nam culpa. Ullam fugit debitis tempore temporibus quod obcaecati incidunt nisi, quia laborum fugiat, pariatur ab quibusdam autem consequatur, alias aut! Ex repellendus ad fugit voluptatum fuga facere optio. Sed neque maxime, ex vero sunt animi debitis veritatis, illum quidem eveniet sequi libero explicabo dolorem quos qui! Tempora rerum molestias doloremque iste asperiores ex necessitatibus perferendis. Qui sed accusantium error inventore? Repellendus obcaecati illum aut fuga ipsa, sapiente tempore eaque. Reiciendis ad mollitia delectus in rerum molestias nisi aperiam consectetur beatae magni repellat deleniti, expedita corporis architecto officia earum sed ipsum eum deserunt, laudantium illum doloremque. Earum consequatur ipsum, beatae repudiandae totam sapiente? Commodi dolorum, velit a harum nihil quae sint voluptate! Molestiae, reiciendis. Debitis in tenetur sapiente. Commodi impedit ipsa vel fugit minima ratione ea delectus distinctio consequuntur beatae, autem sequi adipisci earum iure culpa est, tempore reprehenderit, voluptatum illum. Ab, molestiae ipsum? Similique cum eos dignissimos delectus iste earum in quia perferendis, sapiente deserunt nemo quidem pariatur ipsam quis reiciendis accusamus fugit sequi voluptatibus! Laborum commodi tempora, quis quia fuga vero praesentium dolore aliquid molestiae, necessitatibus sed porro perspiciatis iure pariatur itaque adipisci dolor? Alias eos voluptatum, quae accusantium consectetur quas veritatis incidunt iste, consequatur, dolorum vero. Eius laudantium ab obcaecati ullam, beatae debitis necessitatibus dolor quaerat ratione doloremque impedit dolorem quasi cupiditate natus quidem ex a consequuntur vitae unde! Possimus similique nihil tempore commodi. Ut vero odit excepturi nulla corrupti, expedita atque repellat laborum nobis vel soluta, placeat fugit harum totam nisi inventore deleniti eum culpa optio. Nisi, provident enim temporibus amet molestiae quibusdam, quos dicta odit similique corporis facilis ab dolor eos maiores beatae deserunt dolore. Ipsam eius repellat iste ad maiores. Eligendi asperiores tenetur vitae amet facilis aliquid fuga labore dolorem eaque recusandae itaque excepturi numquam atque culpa, error sed explicabo.', 'Relatório Lorem'),
(3, 9, 1, '2023-11-26', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque nemo facere dignissimos voluptates inventore provident, amet quod labore quibusdam quisquam nesciunt quaerat sapiente pariatur sit accusantium repudiandae aut libero quae id! Accusantium, at? Natus nam soluta molestias repudiandae qui cumque eos enim consequuntur eveniet distinctio, dolorum odit dignissimos magni culpa nostrum ipsam alias facilis unde aliquam. Harum nesciunt neque, fugit reprehenderit, animi omnis quisquam eius iusto dignissimos accusamus facilis quas enim itaque mollitia deserunt temporibus, ratione aliquid sapiente numquam perferendis laborum cum veniam. Omnis labore maiores architecto, quia similique quae sequi hic, autem deserunt veritatis consequatur sed velit odio rem eum, doloribus vero facere esse necessitatibus? Enim hic illo atque cumque libero, nemo repudiandae error deleniti consequuntur, eaque dignissimos in neque quo possimus repellendus vitae velit minima. Quaerat eum, qui sequi ex aliquam delectus sunt impedit facere molestiae, recusandae architecto suscipit! Ut dicta, totam, maxime vero doloremque magnam ratione reprehenderit similique facilis debitis voluptates dolorum eaque sint asperiores sapiente inventore aspernatur nemo a minus explicabo dignissimos quis. Repudiandae, a quos dignissimos placeat odit repellat numquam architecto ipsam, voluptatibus minima officiis, quis consectetur quod qui minus magni. Obcaecati incidunt itaque quo inventore nisi similique ipsa. Debitis tempore laudantium a mollitia nam, molestias ullam ex ipsam voluptatem impedit possimus optio error accusamus dicta alias beatae modi, placeat nulla excepturi quis itaque! Error temporibus veniam quos amet quae cupiditate fuga at neque sapiente, eveniet aliquam id non atque. Ipsum cupiditate deleniti nemo! Inventore itaque similique fuga ipsum adipisci aut eum, quas quis. Hic perspiciatis ab nihil animi quam illo numquam corporis ipsum? Iste, ut ipsam eos, ratione distinctio vel qui cumque et quasi animi, facilis sunt dignissimos ex. Repellendus reprehenderit, perspiciatis illo eius neque pariatur distinctio harum vero voluptatem necessitatibus blanditiis. Voluptate, blanditiis cum! Asperiores consectetur ratione pariatur incidunt voluptatibus veritatis ipsa est sint et quam in eaque repudiandae quis sapiente dolorum sed neque, ab harum, quibusdam quo repellendus quisquam accusantium iure. Nulla temporibus quas quia dolorum aliquam est tenetur ad accusamus, ipsam illum aliquid molestias laborum eos ut nostrum, mollitia beatae provident tempora eveniet dolor ipsum, debitis exercitationem placeat. Aliquam, consequuntur amet.', 'Relatório Lorem II'),
(4, 9, 1, '2023-10-20', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe labore fugiat ipsam facilis laudantium omnis enim, placeat sapiente error fugit rem fuga animi a cupiditate deleniti facere quos delectus, quasi ut? Aliquam deserunt, molestias similique voluptates quisquam illo! Sint dolores ex asperiores esse expedita quam incidunt eligendi blanditiis sed sit cupiditate doloribus suscipit maiores vitae totam, mollitia minima, velit, deleniti in. Minima velit facilis ipsam tenetur, officiis quasi ab, at quia aut maiores quos nulla voluptatem dicta exercitationem provident ad sunt doloribus odit magni nemo numquam quaerat natus laborum? Ab eos nihil expedita consequatur neque deserunt labore est ducimus. In nostrum impedit voluptate fuga incidunt fugit repellat ipsam vero voluptas dolor assumenda doloremque tempora temporibus ab, velit beatae eum non nisi quas qui magni sunt quibusdam adipisci veritatis? Quia, magnam mollitia? Sunt commodi ipsa blanditiis quos. Officiis ea consequuntur accusamus aperiam deserunt rem placeat debitis soluta dolore velit ex omnis provident, doloribus, nobis quae, aliquam quod suscipit? Culpa libero impedit, quod minus doloremque recusandae quia assumenda, sint velit nulla ad consequatur. Dignissimos saepe id et quo ducimus voluptates quis in tempora sed commodi ratione ex veritatis cupiditate vel nobis esse, nisi asperiores cum omnis laborum voluptate odio accusamus. Illum nulla recusandae quam nostrum harum, consequatur corporis officiis placeat amet earum magni et atque aliquam dolore numquam fugiat minus consectetur asperiores ducimus dicta explicabo eveniet sapiente. Quod maxime animi voluptatum nesciunt? Perferendis, placeat adipisci deleniti voluptatibus cupiditate quasi sit et necessitatibus recusandae maiores at maxime inventore nam neque itaque aspernatur dignissimos provident eum unde minima repudiandae rerum soluta? Optio qui distinctio sint adipisci nihil blanditiis? Ipsum eos quae blanditiis quos perferendis totam quaerat eaque libero doloremque dignissimos eum veniam reprehenderit pariatur eius modi et, hic praesentium delectus omnis corporis! Laborum eaque vero repudiandae cum id, nobis, itaque enim quasi obcaecati accusantium tempora ex nisi explicabo alias quod quisquam laboriosam sequi illo quis. Veniam adipisci hic atque corrupti nobis quia quo quod culpa, consequuntur quas magnam saepe voluptate eaque distinctio illo cupiditate non autem dolore commodi explicabo eveniet cumque. Asperiores expedita, quae fugit ducimus corrupti accusamus ab sunt minus quod nemo sapiente labore. Corrupti, nemo. Similique totam repellat eveniet perspiciatis sunt doloremque maiores quod! Ad minima aspernatur error. Dicta numquam exercitationem perspiciatis in veniam officiis iure vel velit placeat! Nulla, doloribus aut?', 'Relatório Lorem III');

CREATE TABLE `turma` (
  `codigo` int(11) NOT NULL,
  `periodo` varchar(10) NOT NULL,
  `ano_letivo` varchar(4) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `vagas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `turma` (`codigo`, `periodo`, `ano_letivo`, `data_inicio`, `data_fim`, `vagas`) VALUES
(1, 'Matutino', '2024', '2024-01-01', '2025-01-01', 180),
(6, 'Noturno', '2026', '2025-01-01', '2025-12-01', 25),
(9, 'Matutino', '2023', '2023-06-01', '2023-12-01', 50);

CREATE TABLE `turma_curso` (
  `turma_codigo` int(11) NOT NULL,
  `curso_codigo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `turma_curso` (`turma_codigo`, `curso_codigo`) VALUES
(1, 1),
(1, 7),
(6, 1),
(6, 7),
(9, 2);

CREATE TABLE `turma_funcionario` (
  `turma_codigo` int(11) NOT NULL,
  `funcionario_codigo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `turma_funcionario` (`turma_codigo`, `funcionario_codigo`) VALUES
(1, 4),
(1, 5),
(6, 4),
(6, 5),
(9, 5),
(9, 9);

CREATE TABLE `vinculacao` (
  `codigo` int(11) NOT NULL,
  `empresa_codigo` int(11) NOT NULL,
  `aluno_codigo` int(11) NOT NULL,
  `data_vinculacao` date NOT NULL,
  `status` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `vinculacao` (`codigo`, `empresa_codigo`, `aluno_codigo`, `data_vinculacao`, `status`) VALUES
(9, 3, 17, '2023-11-23', 1),
(10, 3, 2, '2023-11-23', 1),
(11, 3, 1, '2023-11-23', 1),
(12, 2, 3, '2023-11-23', 1),
(13, 2, 20, '2023-11-23', 1),
(14, 2, 1, '2023-11-23', 1);


ALTER TABLE `aluno`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `cpf_UNIQUE` (`cpf`),
  ADD UNIQUE KEY `rg_UNIQUE` (`rg`),
  ADD KEY `fk_aluno_pessoa_info1_idx` (`pessoa_info_codigo`);

ALTER TABLE `atribuicao`
  ADD PRIMARY KEY (`funcionario_codigo`,`cargo_codigo`),
  ADD KEY `fk_funcionario_cargo_cargo1_idx` (`cargo_codigo`),
  ADD KEY `fk_funcionario_cargo_funcionario1_idx` (`funcionario_codigo`);

ALTER TABLE `cargo`
  ADD PRIMARY KEY (`codigo`);

ALTER TABLE `curso`
  ADD PRIMARY KEY (`codigo`);

ALTER TABLE `empresa`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `cnpj_UNIQUE` (`cnpj`),
  ADD UNIQUE KEY `ie_UNIQUE` (`ie`),
  ADD KEY `fk_empresa_pessoa_info1_idx` (`pessoa_info_codigo`);

ALTER TABLE `funcionario`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `cpf_UNIQUE` (`cpf`),
  ADD UNIQUE KEY `nome_usuario_UNIQUE` (`nome_usuario`),
  ADD KEY `fk_funcionario_pessoa_info1_idx` (`pessoa_info_codigo`);

ALTER TABLE `inscricao`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `fk_turma_aluno_aluno1_idx` (`aluno_codigo`),
  ADD KEY `fk_turma_aluno_turma1_idx` (`turma_codigo`);

ALTER TABLE `frequencia`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `fk_aluno_frequencia_idx` (`aluno_codigo`),
  ADD KEY `fk_turma_frequencia_idx` (`turma_codigo`),
  ADD KEY `fk_curso_frequencia_idx` (`curso_codigo`);

ALTER TABLE `orientador`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `fk_orientador_empresa_idx` (`empresa_codigo`),
  ADD KEY `fk_orientador_funcionario_idx` (`funcionario_codigo`);

ALTER TABLE `pessoa_info`
  ADD PRIMARY KEY (`codigo`);

ALTER TABLE `relatorio_aprendiz`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `fk_aluno_relatorio_idx` (`aluno_codigo`),
  ADD KEY `fk_funcionario_relatorio_idx` (`funcionario_codigo`);

ALTER TABLE `turma`
  ADD PRIMARY KEY (`codigo`);

ALTER TABLE `turma_curso`
  ADD PRIMARY KEY (`turma_codigo`,`curso_codigo`),
  ADD KEY `fk_turma_curso_curso1_idx` (`curso_codigo`),
  ADD KEY `fk_turma_curso_turma1_idx` (`turma_codigo`);

ALTER TABLE `turma_funcionario`
  ADD PRIMARY KEY (`turma_codigo`,`funcionario_codigo`),
  ADD KEY `fk_turma_funcionario_funcionario1_idx` (`funcionario_codigo`),
  ADD KEY `fk_turma_funcionario_turma1_idx` (`turma_codigo`);

ALTER TABLE `vinculacao`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `fk_empresa_aluno_aluno1_idx` (`aluno_codigo`),
  ADD KEY `fk_empresa_aluno_empresa1_idx` (`empresa_codigo`);


ALTER TABLE `aluno`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

ALTER TABLE `cargo`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `curso`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

ALTER TABLE `empresa`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `funcionario`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `inscricao`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

ALTER TABLE `frequencia`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `orientador`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `pessoa_info`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

ALTER TABLE `relatorio_aprendiz`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

ALTER TABLE `turma`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `vinculacao`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;


ALTER TABLE `aluno`
  ADD CONSTRAINT `fk_aluno_pessoa_info1` FOREIGN KEY (`pessoa_info_codigo`) REFERENCES `pessoa_info` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `atribuicao`
  ADD CONSTRAINT `fk_funcionario_cargo_cargo1` FOREIGN KEY (`cargo_codigo`) REFERENCES `cargo` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_funcionario_cargo_funcionario1` FOREIGN KEY (`funcionario_codigo`) REFERENCES `funcionario` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `empresa`
  ADD CONSTRAINT `fk_empresa_pessoa_info1` FOREIGN KEY (`pessoa_info_codigo`) REFERENCES `pessoa_info` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `funcionario`
  ADD CONSTRAINT `fk_funcionario_pessoa_info1` FOREIGN KEY (`pessoa_info_codigo`) REFERENCES `pessoa_info` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `inscricao`
  ADD CONSTRAINT `fk_turma_aluno_aluno1` FOREIGN KEY (`aluno_codigo`) REFERENCES `aluno` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_turma_aluno_turma1` FOREIGN KEY (`turma_codigo`) REFERENCES `turma` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `frequencia`
  ADD CONSTRAINT `fk_aluno_frequencia` FOREIGN KEY (`aluno_codigo`) REFERENCES `aluno` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_turma_frequencia` FOREIGN KEY (`turma_codigo`) REFERENCES `turma` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_curso_frequencia` FOREIGN KEY (`curso_codigo`) REFERENCES `curso` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `orientador`
  ADD CONSTRAINT `fk_orientador_empresa` FOREIGN KEY (`empresa_codigo`) REFERENCES `empresa` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_orientador_funcionario` FOREIGN KEY (`funcionario_codigo`) REFERENCES `funcionario` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `relatorio_aprendiz`
  ADD CONSTRAINT `fk_aluno_relatorio` FOREIGN KEY (`aluno_codigo`) REFERENCES `aluno` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_funcionario_relatorio` FOREIGN KEY (`funcionario_codigo`) REFERENCES `funcionario` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `turma_curso`
  ADD CONSTRAINT `fk_turma_curso_curso1` FOREIGN KEY (`curso_codigo`) REFERENCES `curso` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_turma_curso_turma1` FOREIGN KEY (`turma_codigo`) REFERENCES `turma` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `turma_funcionario`
  ADD CONSTRAINT `fk_turma_funcionario_funcionario1` FOREIGN KEY (`funcionario_codigo`) REFERENCES `funcionario` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_turma_funcionario_turma1` FOREIGN KEY (`turma_codigo`) REFERENCES `turma` (`codigo`) ON DELETE CASCADE;

ALTER TABLE `vinculacao`
  ADD CONSTRAINT `fk_empresa_aluno_aluno1` FOREIGN KEY (`aluno_codigo`) REFERENCES `aluno` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_empresa_aluno_turma1` FOREIGN KEY (`empresa_codigo`) REFERENCES `empresa` (`codigo`) ON DELETE CASCADE;
COMMIT;
