export const defaultThresholds = {
  http_req_duration: ['p(95)<900'],   // 95% das requisições < 900ms
  checks: ['rate>0.95']               // mínimo 95% de checks passando
};

export const strictThresholds = {
  http_req_duration: ['p(95)<500'],   // versão mais rígida
  http_req_failed: ['rate<0.01'],     // menos de 1% com erro
  checks: ['rate>0.98']
};
export const relaxedThresholds = {
  http_req_duration: ['p(95)<1200'],  // versão mais relaxada
  checks: ['rate>0.90']
};