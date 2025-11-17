export interface ArquivoDto {
    id?: number;
    nomeArquivo?: string | null;
    dataRecebimento?: string;
    dataExpiracao?: string | null;
    status?: string | null;
    tipoAdquirente?: string | null;
    tamanhoBytes?: number;
    mensagemErro?: string | null;
    quantidadeTransacoes?: number;
}
