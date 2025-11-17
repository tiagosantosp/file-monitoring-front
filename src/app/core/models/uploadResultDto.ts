import { ArquivoDto } from './arquivoDto';

export interface UploadResultDto {
    sucesso?: boolean;
    mensagem?: string | null;
    arquivo?: ArquivoDto;
}
