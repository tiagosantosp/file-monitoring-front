export interface TransacaoArquivoDto {
    id?: number;
    tipoRegistro?: string | null;
    estabelecimento?: string | null;
    dataProcessamento?: string;
    periodoInicial?: string;
    periodoFinal?: string;
    sequencia?: string | null;
    empresa?: string | null;
}
