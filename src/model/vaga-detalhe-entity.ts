export class VagaDetalheEntity {

      public idVaga: number;
      public idEmpresa: number;
      public idCidade: number;
      public idEstado: number;
      public nomeEmpresa: string;
      public nomeFornecedor: string;
      public cidade: string;
      public cidadeEstadoFormat: string;
      public nome: string;
      public detalheVaga: string;
      public dataInicial: Date;
      public dataFinal: Date;
      public dataEncerramentoFormat: string;
      public dataInicialFormat: string;
      public dataFinalFormat: string;
      public qtdVaga: number;
      public salarioHomem: number;
      public salarioHomemAte: number;
      public salarioMulher: number;
      public salarioMulherAte: number;
      public sexoEnum: string;
      public sexoFormat: string;
      public grauEntendimentoEnum: string;
      public grauFalaEnum: string;
      public grauEscritaEnum: string;
      public statusVaga: string;
      public limiteDados: number;
      public isCandidatado: boolean;
      public possuiCandidatosEnumFormat: string;

      constructor(){
      }

    }
