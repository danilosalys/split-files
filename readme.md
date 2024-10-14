# SERVIÇO SPLIT FILES SEVENPDV

Este serviço tem por objetivo efetuar a quebra de arquivos enviados em lotes pela Van SevenPDV, para que o processamento das partes do arquivo seja efetuado em mais de uma instância no Mercanet.

## Documentação

[Especificação Funcional]

- X:\setores\TI\Arquivos\Sistemas\Modulo do Sistema\Operação Logistica Mercanet\02 - Funcional\SS - 222421 - Split de Lotes SevenPDV e Distribuidor de Pedidos

[Especificação Técnica]

- X:\setores\TI\Arquivos\Sistemas\Modulo do Sistema\Operação Logistica Mercanet\03 - Técnica\SS - 222421 - Split de Lotes SevenPDV e Distribuidor de Pedidos

[Plano de Testes]

- X:\setores\TI\Arquivos\Sistemas\Modulo do Sistema\Operação Logistica Mercanet\04 - Teste\SS - 222421 - Split de Lotes SevenPDV e Distribuidor de Pedidos

[GMUD]

- X:\setores\TI\Arquivos\Sistemas\Modulo do Sistema\Operação Logistica Mercanet\05 - Solicitação de Mudança\GMUD XXXXX SS - 222421 - Split de Lotes SevenPDV e Distribuidor de Pedidos

## Arquitetura e stacks

Este serviço foi desenvolvido em NodeJS, na versão v20.10.0, porém roda em versões anteriores também. Atualmente esta rodando na versão v12.12.12 devido ao SO do servidor SRVDC41 ser Windows Server 2008.
Para que funcione, é preciso que o NODE esteja instalado.
As stacks utilizadas podem ser consultadas no arquivo package.json na raiz do projeto.

## Rodando localmente em ambiente de desenvolvimento

Clone o projeto

```bash
  git clone https://github.com/dcentergit/dc-split-files.git
```

Entre no diretório do projeto

```bash
  cd dc-split-files
```

Instale as dependências

```bash
  npm install
```

Efetue as configurações do arquivo config.json

- **inputFolder**: O diretório de entrada onde os arquivos SevenPDV são recebidos para processamento.
- **outputFolder**: O diretório de saída onde os arquivos processados são armazenados após a divisão.
- **sendFolders**: Lista de diretórios para envio dos arquivos divididos. Cada diretório na lista representa uma pasta de destino para os arquivos divididos.
- **splitedFilesFolder**: O diretório onde os arquivos originais são movidos após a divisão, para backup ou fins de registro.
- **logFolder**: O diretório onde os registros de log serão armazenados.
- **qtyLinesSplit**: O número máximo de linhas por arquivo ao dividir os arquivos SevenPDV.
- **groupOrdersByOnlyCNPJ**: Um sinalizador booleano que indica se os pedidos devem ser agrupados apenas pelo número do CNPJ.
- **recordLogs**: Um sinalizador booleano que indica se os registros de log devem ser registrados.
- **logType**: O tipo de log a ser registrado (0 para registrar somente logs do tipo ERROR e 1 para registrar ERROR e INFOs também).
- **timeIntervalCheckFolder**: O intervalo de tempo (em minutos) para verificar a pasta de entrada para novos arquivos.

Observações:
Certifique-se de fornecer os caminhos absolutos corretos para os diretórios e arquivos.
Os caminhos para os diretórios devem estar no formato correto para o sistema operacional em que o código será executado.
As configurações podem ser ajustadas conforme necessário para atender aos requisitos específicos do ambiente de execução.

## AMBIENTE DE TESTES
Inicie o servidor

```bash
  npm run dev
```

## Execução dos testes unitários

```bash
  npm run test
```

## Instalação e Desinstalação do Serviço no Ambiente de Produção

[para instalar]

1. Caso não esteja instalado, faça a instalação do agent do Consul (monitor de saude do serviço)

- Abra o terminal com permissões de administrador e execute o comando abaixo (lembre-se de alterar os caminhos)

sc.exe create "Consul-service" binPath= "e:\consul\consul.exe agent -config-dir e:\consul\config" DisplayName= "Consul-service" start= auto

2. Copie o diretorio do projeto no servidor a ser instalado

3. Faça a configuração do arquivo config.json

4. Execute o script de instalação

```bash
  npm run install-service
```

Após a instalação o serviço será executado automaticamente.

[para desinstalar]

5. Execute o script de desinstalação

```bash
  npm run uninstall-service
```

## Autor

- [@danilosales](https://github.com/danilosalys)
