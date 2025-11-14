import math
derating = float(0.77)
potenciapanel = int(450)
autonomia = int(24)
DOD = float(0.8)
eficiencia_inversor = float(0.77)
margen = 1.1
pico = int(3)
tmin = int(-10)
coefvoc = float(-0.24)
Vmppanel = float(44.6)
vocpanel = float(52.9)
iscpanel = float (10.74)
maxinversor = int(25)
Vocmaxinversor = int(600)
VmpMPPTmax = int(480)
VmpMPPTmin = int(200)

no son constantes son las variables decididas por la encuest y api

costomensual = int(120000)
cargofijo = int(1196.96)
cargoconsumo = int(293.65)
porcentajecobertura = int(100)
porcentajecoberturaactual = int(0)
consumo = ((costomensual - cargofijo)/cargoconsumo)* (porcentajecobertura-porcentajecoberturaactual)/100
PSH = int(5)
energiadiaria = consumo/3
energiaporpanel= potenciapanel/1000*PSH*eficiencia_inversor
numeropaneles = math.ceil(energiadiaria/energiaporpanel)
potenciaDC = numeropaneles * potenciapanel / 1000
voctempmin = vocpanel * (1 + (coefvoc/100 * (tmin - 25)))
vmptempmin = Vmppanel * (1 + (coefvoc/100 * (tmin - 25)))
panelesporVoc = round(Vocmaxinversor/voctempmin)
