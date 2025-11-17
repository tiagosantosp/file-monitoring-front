export interface EstatisticasDto {
    totalArquivos?: number;
    arquivosRecepcionados?: number;
    arquivosNaoRecepcionados?: number;
    percentualSucesso?: number;
    porAdquirente?: { [key: string]: number; } | null;
}
