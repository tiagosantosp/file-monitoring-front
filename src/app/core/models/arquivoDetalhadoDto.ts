import { TransacaoArquivoDto } from './transacaoArquivoDto';

export interface ArquivoDetalhadoDto {
    id?: number;
    nomeArquivo?: string | null;
    dataRecebimento?: string;
    dataExpiracao?: string | null;
    status?: string | null;
    tipoAdquirente?: string | null;
    tamanhoBytes?: number;
    caminhoBackup?: string | null;
    hashMD5?: string | null;
    mensagemErro?: string | null;
    transacoes?: Array<TransacaoArquivoDto> | null;
}
